Purchasing::Application.routes.draw do

  scope '/api/1.0' do
    resources :purchases, except: [:new, :edit]

    # Receive all on a purchase
    post 'purchases/:id/receive_all' => 'purchases#receive_all'

    # Email a purchase
    post 'purchases/:id/email' => 'purchases#email_purchase'

    # Reconcile records
    post 'purchases/reconcile' => 'purchases#reconcile'

    # Assign records
    post 'purchases/assign' => 'purchases#assign'

    # Search purchases
    get 'search' => 'search#index', as: 'search_purchases'

    resources :attachments, except: [:show, :new, :edit]
    resources :vendors, except: [:new, :edit]
    resources :accounts, except: [:new, :edit]
    resources :receivings, except: [:index, :show, :new, :edit]
    resources :tags, except: [:show, :new, :edit]
    resources :canned_messages, except: [:show, :new, :edit]

    # JSON lookup for TokenInput
    get 'vendor_tokens' => 'vendors#token_request', constraints: { format: /(json)/ }
    get 'user_tokens' => 'users#token_request', constraints: { format: /(json)/ }

    if Rails.env.development? || Rails.env.test?
      resources :users do # TODO
        get 'impersonate', on: :collection
        get 'stop_impersonating', on: :collection
      end
    end

    post 'users/:id/accounts' => 'users#my_accounts'
  end

  # Root
  root 'ember#index'
  get '/logout' => -> env { [200, { 'Content-Type' => 'text/html' }, ['Rack::CAS should have caught this']] }, as: :logout


  # Development routes
  if Rails.env.development? || Rails.env.test?
    get '/qunit' => 'test#index'
  end


# The Rails RESTful rubric
#GET 	      /photos 	        index 	  display a list of all photos
#GET 	      /photos/new 	    new 	    return an HTML form for creating a new photo
#POST 	    /photos 	        create 	  create a new photo
#GET 	      /photos/:id 	    show 	    display a specific photo
#GET 	      /photos/:id/edit 	edit 	    return an HTML form for editing a photo
#PATCH/PUT 	/photos/:id 	    update 	  update a specific photo
#DELETE 	  /photos/:id 	    destroy 	delete a specific photo

end
