class SearchController < ApplicationController

  filter_resource_access

  def index

    vendor = params[:vendor]
    requester = params[:requester]
    department = params[:department]
    recipient = params[:recipient]
    buyer = params[:buyer]
    purSearch = params[:purSearch]
    purType = params[:purType]
    dateRequested = buildDateRange(params[:dateRequestedMin], params[:dateRequestedMax])
    datePurchased = buildDateRange(params[:datePurchasedMin], params[:datePurchasedMax])
    dateExpected = buildDateRange(params[:dateExpectedMin], params[:dateExpectedMax])
    includeReceived = params[:includeReceived] || false
    lines = params[:lines]

    page = params[:searchPage] || 1
    sort = params[:sort] || 'dateRequested'
    direction = params[:direction] || 'DESC'

    sort_field = getSortFieldFromString(sort)
    sort_direction = (direction == 'DESC' ) ? :desc : nil

    if record_params.length == 0 || record_params.reduce([]) { |r, v| r << v if !v[1].empty?; r }.length == 0
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
        fulltext department do
          fields(:department)
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
        fulltext purType do
          fields(:purchase_type)
        end

        with(:date_requested, dateRequested) unless dateRequested.blank?
        with(:date_purchased, datePurchased) unless datePurchased.blank?
        with(:date_expected, dateExpected) unless dateExpected.blank?

        with(:received, false) if includeReceived != 'true'

        order_by(:starred, :desc)
        if sort_direction
          order_by(sort_field, sort_direction)
        else
          order_by(sort_field)
        end

        paginate :page => page, :per_page => Settings.app.pagination.per_page
      end

    purchases = search.results

    # Rescue block from CentralStores
    rescue Errno::ECONNREFUSED, RSolr::Error::Http
      render json: 'Error: the search server refused a connection', status: :unprocessable_entity
      return
    end

    render json: purchases,
           meta:  { per_page:  Settings.app.pagination.per_page,
                    total_count: search.results.total_count,
                    found_count: search.results.length,
                    page: page,
                    sort: sort,
                    direction: direction,
                    tags: Tag.list,
                  },
           root: 'purchases',
           status: :ok
  end

  private

  #Convert the field names for the purchase model to their solr sort fields
  def getSortFieldFromString(val)
    case(val)
    when 'buyer.name'
      :buyer_sort
    when 'requester.department'
      :department_sort
    when 'requester.name'
      :requester_sort
    when 'vendor_string'
      :vendor_sort
    when 'dateRequested'
      :date_requested
    end
  end

  def buildDateRange(date1, date2)
    return nil if date1.blank? && date2.blank?

    date1 = DateTime.parse('1/1/1980').strftime(Settings.app.DateString) if date1.blank?
    date2 = DateTime.now.strftime(Settings.app.dateString) if date2.blank?

    (date1..date2)
  end

  def record_params
    params.permit(:searchPage, :vendor, :requester, :recipient, :buyer, :purSearch,
                  :dateRequestedMin, :dateRequestedMax, :datePurchasedMin, :datePurchasedMax,
                  :dateExpectedMin, :dateExpectedMax, :includeReceived, :lines)
  end

end
