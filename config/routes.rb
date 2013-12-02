Purchasing::Application.routes.draw do

  resources :purchases, except: [:new, :edit]
  resources :attachments, except: [:index, :show, :new, :edit, :update]

  resources :vendors, except: [:new, :edit]
  resources :accounts, except: [:new, :edit]
  resources :receivings, except: [:index, :show, :new, :edit, :destroy]
  resources :tags, except: [:show, :new, :edit]

  resources :users do # TODO
    get 'impersonate', on: :collection
    get 'stop_impersonating', on: :collection
  end

  get 'search' => 'search#index', as: 'search_purchases'

  # Star or unstar a purchase
  post 'purchases/:id/toggle_starred' => 'purchases#toggle_starred'
  # Receive all on a purchase
  post 'purchases/:id/receive_all' => 'purchases#receive_all'
  # Reconcile records
  post 'purchases/reconcile' => 'purchases#reconcile'
  # Assign records
  post 'purchases/assign' => 'purchases#assign'

  # JSON lookup for TokenInput
  get 'vendor_tokens' => 'vendors#token_request', constraints: { format: /(json)/ }
  get 'user_tokens' => 'users#token_request', constraints: { format: /(json)/ }

  #root 'purchases#index'
  root 'ember#index'

  get '/logout' => -> env { [200, { 'Content-Type' => 'text/html' }, ['Rack::CAS should have caught this']] }, as: :logout

# The Rails RESTful rubric
#GET 	      /photos 	        index 	  display a list of all photos
#GET 	      /photos/new 	    new 	    return an HTML form for creating a new photo
#POST 	    /photos 	        create 	  create a new photo
#GET 	      /photos/:id 	    show 	    display a specific photo
#GET 	      /photos/:id/edit 	edit 	    return an HTML form for editing a photo
#PATCH/PUT 	/photos/:id 	    update 	  update a specific photo
#DELETE 	  /photos/:id 	    destroy 	delete a specific photo

end
