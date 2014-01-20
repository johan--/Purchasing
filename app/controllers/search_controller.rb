class SearchController < ApplicationController

  filter_resource_access

  def index

    page = params[:searchPage] || 1

    vendor = params[:vendor]
    requester = params[:requester]
    buyer = params[:buyer]
    quickSearch = params[:quickSearch]
    dateRequestedMin = params[:dateRequestedMin]
    dateRequestedMax = params[:dateRequestedMax]
    datePurchasedMin = params[:datePurchasedMin]
    datePurchasedMax = params[:datePurchasedMax]
    dateExpectedMin = params[:dateExpectedMin]
    dateExpectedMax = params[:dateExpectedMax]
    lines = params[:lines]

    sort = params[:sort] || 'date'
    direction = params[:direction] || 'DESC'
    filterBuyer = params[:filterBuyer]

    sum = "#{quickSearch}#{lines}#{vendor}#{requester}#{buyer}#{dateRequestedMin}#{dateRequestedMax}" +
          "#{datePurchasedMin}#{datePurchasedMax}#{dateExpectedMin}#{dateExpectedMax}";

    puts params
    puts '-' * 20

    if sum.nil? || sum.empty?
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

        fulltext quickSearch unless quickSearch.nil?
        fulltext vendor do
          fields(:vendors)
        end
        fulltext requester do
          fields(:requester)
        end
        fulltext buyer do
          fields(:buyer)
        end
        fulltext lines do
          fields(:lines)
        end

        with(:date_requested, dateRequestedMin..dateRequestedMax) unless dateRequestedMin.nil?
        with(:date_purchased, datePurchasedMin..datePurchasedMax) unless datePurchasedMin.nil?
        with(:date_expected, dateExpectedMin..dateExpectedMax) unless dateExpectedMin.nil?
        with(:buyer_id, filterBuyer) unless filterBuyer.nil?

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

                    quickSearch: quickSearch,
                    vendor: vendor,
                    requester: requester,
                    buyer: buyer,
                    dateRequestedMin: dateRequestedMin,
                    dateRequestedMax: dateRequestedMax,
                    datePurchasedMin: datePurchasedMin,
                    datePurchasedMax: datePurchasedMax,
                    dateExpectedMin: dateExpectedMin,
                    dateExpectedMax: dateExpectedMax,
                    lines: lines,

                    page: page,
                    sort: sort,
                    direction: direction,

                    tags: Tag.list,
                    taxCodes: Settings.app.tax_codes,
                  },
           root: 'purchases'
  end

end
