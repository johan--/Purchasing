class SearchController < ApplicationController

  filter_resource_access

  def index

    page = params[:searchPage] || 1

    vendor = params[:vendor]
    requester = params[:requester]
    recipient = params[:recipient]
    buyer = params[:buyer]
    purSearch = params[:purSearch]
    dateRequested = buildDateRange(params[:dateRequestedMin], params[:dateRequestedMax])
    datePurchased = buildDateRange(params[:datePurchasedMin], params[:datePurchasedMax])
    dateExpected = buildDateRange(params[:dateExpectedMin], params[:dateExpectedMax])
    includeReceived = params[:includeReceived] || false
    lines = params[:lines]

    sort = params[:sort] || 'dateRequested'
    direction = params[:direction] || 'DESC'

    if record_params.length == 0 || record_params.reduce([]) { |r, v| r << v if !v[1].empty?; r }.length == 0
      puts 'no params detected'
      render json: "No parameters were given",
             meta: { lines: lines },
             status: :unprocessable_entity
      return
    end

    begin
      search = Purchase.search(include: [ :vendors, :tags, :buyer, :requester, :recipient,
                          { line_items: :receiving_lines },
                          { receivings: :receiving_lines }
                        ]) do

        fulltext purSearch unless purSearch.nil?
        fulltext vendor do
          fields(:vendors)
        end
        fulltext requester do
          fields(:requester)
        end
        fulltext recipient do
          fields(:recipient)
        end
        fulltext buyer do
          fields(:buyer)
        end
        fulltext lines do
          fields(:lines)
        end

        with(:date_requested, dateRequested) unless dateRequested.blank?
        with(:date_purchased, datePurchased) unless datePurchased.blank?
        with(:date_expected, dateExpected) unless dateExpected.blank?

        with(:received, false) if includeReceived != 'true'

        order_by(:starred, :desc)
        order_by(:date_requested, :desc)
        paginate :page => page, :per_page => Settings.app.pagination.per_page
      end

    purchases = search.results

    # Rescue block from CentralStores
    rescue Errno::ECONNREFUSED, RSolr::Error::Http => error
      case error
      when Errno::ECONNREFUSED
        # Can't connect to the search engine
        # search = Purchase.search_lines(lines)
        purchases = Purchase.
                    eager_min.
                    search_lines(lines).
                    page(page).
                    per(Settings.app.pagination.per_page)

      when RSolr::Error::Http
        # If there is an error like a Solr parse error, just act like we didn't find anything
        search = Purchase.where('false') # hackey way to get empty ActiveRecord::Relation
        purchases = search.page(nil)
      end
    end

    render json: purchases,
           meta:  { per_page:  Settings.app.pagination.per_page,
                    total_count: search.results.total_count,
                    found_count: search.results.length,

                    purSearch: purSearch,
                    vendor: vendor,
                    requester: requester,
                    buyer: buyer,
                    dateRequestedMin: (dateRequested) ? dateRequested.min : nil,
                    dateRequestedMax: (dateRequested) ? dateRequested.max : nil,
                    datePurchasedMin: (datePurchased) ? datePurchased.min : nil,
                    datePurchasedMax: (datePurchased) ? datePurchased.max : nil,
                    dateExpectedMin: (dateExpected) ? dateExpected.min : nil,
                    dateExpectedMax: (dateExpected) ? dateExpected.max : nil,
                    includeReceived: includeReceived,
                    lines: lines,

                    page: page,
                    sort: sort,
                    direction: direction,

                    tags: Tag.list,
                    taxCodes: Settings.app.tax_codes,
                  },
           root: 'purchases',
           status: :ok
  end

  private

  def buildDateRange(date1, date2)
    return nil if date1.blank? && date2.blank?

    date1 = DateTime.parse('1/1/1980') if date1.blank?
    date2 = DateTime.now if date2.blank?

    (date1..date2)
  end

  def record_params
    params.permit(:searchPage, :vendor, :requester, :recipient, :buyer, :purSearch,
                  :dateRequestedMin, :dateRequestedMax, :datePurchasedMin, :datePurchasedMax,
                  :dateExpectedMin, :dateExpectedMax, :includeReceived, :lines)
  end

end
