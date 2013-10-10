class SearchController < ApplicationController

  filter_resource_access

  def index
    if params[:search].nil?
      render :index and return
    end

    page = params[:page] || 1
    vendor = params[:vendor]
    requester = params[:requester]
    buyer = params[:buyer]
    date_requested = params[:date_requested]
    date_ordered = params[:date_ordered]
    date_expected = params[:date_expected]
    lines = params[:lines]

    sum = "#{lines}#{vendor}#{requester}#{buyer}#{date_requested}#{date_ordered}#{date_expected}";
    if sum.nil? || sum.empty?
      flash_notice(:notice, 'Please enter a search parameter')
      render :index and return
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
        @search = Purchase.search_lines(lines)
        @purchases = @search.page(page).eager_min
    #  when RSolr::Error::Http
    #    # If there is an error like a Solr parse error, just act like we didn't find anything
    #    @search = Purchase.where('1 == 0') # hackey way to get empty ActiveRecord::Relation
    #    @purchases = @search.page(nil)
    #  end
    #end

    if @purchases.length == 0
      flash_notice(:notice, 'No records were found matching those parameters')
      render :index and return
    end

    render :search_results
  end

end
