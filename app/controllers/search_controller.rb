class SearchController < ApplicationController

  filter_resource_access

  def index

    page = params[:searchPage] || 1
    vendor = params[:vendor]
    requester = params[:requester]
    buyer = params[:buyer]
    quickSearch = params[:quickSearch]
    dateRequested = params[:dateRequested]
    datePurchased = params[:datePurchased]
    dateExpected = params[:dateExpected]
    dateRequired = params[:dateRequired]
    lines = params[:lines]

    sort = params[:sort] || 'date'
    direction = params[:direction] || 'DESC'
    filterBuyer = params[:filterBuyer] || 'All'

    sum = "#{quickSearch}#{lines}#{vendor}#{requester}#{buyer}#{dateRequested}#{datePurchased}#{dateExpected}";

    if sum.nil? || sum.empty?
      render json: "No parameters were given",
             meta: { lines: lines },
             status: :unprocessable_entity
      return
    end

    begin
      search = Purchase.buyer(filterBuyer).search(include: [ :vendors, :tags, :buyer, :requester, :recipient,
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

        with(:date_requested, dateRequested) unless dateRequested.nil?
        with(:date_purchased, datePurchased) unless datePurchased.nil?
        with(:date_required, dateRequired) unless dateRequired.nil?

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

    total_pages = (1.0 * search.results.total_count / Settings.app.pagination.per_page).ceil

    render json: purchases,
           meta:  { total_pages: total_pages,
                    found_count: purchases.length,

                    quickSearch: quickSearch,
                    vendor: vendor,
                    requester: requester,
                    buyer: buyer,
                    dateRequested: dateRequested,
                    datePurchased: datePurchased,
                    dateExpected: dateExpected,
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
