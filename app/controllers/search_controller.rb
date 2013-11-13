class SearchController < ApplicationController

  filter_resource_access

  def index

    page = params[:purPage] || 1
    vendor = params[:vendor]
    requester = params[:requester]
    buyer = params[:buyer]
    date_requested = params[:date_requested]
    date_ordered = params[:date_ordered]
    date_expected = params[:date_expected]
    lines = params[:lines]

    sort = params[:sort] || 'date'
    direction = params[:direction] || 'DESC'
    min = params[:filterMinDate] || 'Jan 1, 1980'
    max = params[:filterMaxDate] || Time.now.strftime("%b %-d, %Y")
    include_receiving = (params[:filterReceiving] || 2).to_i
    include_pending = (params[:filterPending] || 2).to_i

    sum = "#{lines}#{vendor}#{requester}#{buyer}#{date_requested}#{date_ordered}#{date_expected}";

    if sum.nil? || sum.empty?
      render json: "No parameters were given",
             meta: { lines: lines },
             status: :unprocessable_entity
      return
    end

    #begin
    #  @search = Purchase.solr_search do
        #fulltext vendor { fields(:vendors) }
        #fulltext requester { fields(:requester) }
        #fulltext buyer { fields(:buyer) }
        #fulltext date_requested { fields(:date_requested) }
        #fulltext date_ordered { fields(:date_ordered) }
    #    fulltext @lines do
    #      fields(:lines)
    #    end
    #    paginate :page => page, :per_page => 50
    #  end
    #  @purchases = @search.results.eager_min  ## TODO Eager load relations

    # Rescue block from CentralStores
    #rescue Errno::ECONNREFUSED, RSolr::Error::Http => error
    #  case error
    #  when Errno::ECONNREFUSED
        # Can't connect to the search engine
        # search = Purchase.search_lines(lines)
        purchases = Purchase.
                    eager_min.
                    search_lines(lines).
                    page(page).
                    per(Settings.app.pagination.per_page)
    #  when RSolr::Error::Http
    #    # If there is an error like a Solr parse error, just act like we didn't find anything
    #    @search = Purchase.where('1 == 0') # hackey way to get empty ActiveRecord::Relation
    #    @purchases = @search.page(nil)
    #  end
    #end

    total_pages = (1.0 * purchases.total_count / Settings.app.pagination.per_page).ceil

    render json: purchases,
           meta:  { total_pages: total_pages,
                    found_count: purchases.length,
                    page: page,
                    sort: sort,
                    lines: lines,
                    direction: direction,
                    tags: Tag.list,
                    taxCodes: Settings.app.tax_codes,
                    buyers: User.buyers,
                    vendor: vendor,
                    filterMinDate: min,
                    filterMaxDate: max,
                    filterReceiving: (include_receiving == 2) ? true : false,
                    filterPending: (include_pending == 2) ? true : false },
           root: 'purchases'
  end
end
