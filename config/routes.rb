Purchasing::Application.routes.draw do

  mount UserImpersonate::Engine => "/impersonate", as: "impersonate_engine"

  resources :vendors, except: [:new, :edit]
  resources :purchases, except: [:new, :edit]
  resources :accounts, except: [:new, :edit]
  resources :tags, except: [:show, :new, :edit, :update]
  patch 'tags' => 'tags#update'

  resources :users

  get 'search' => 'search#index', as: 'search_purchases'

  # Receive all on a purchase
  post 'purchases/:id/receive_all' => 'purchases#receive_all'

  # JSON lookup for TokenInput
  get 'vendor_tokens' => 'vendors#token_request', constraints: { format: /(json)/ }
  get 'user_tokens' => 'users#token_request', constraints: { format: /(json)/ }

  #root 'purchases#index'
  root 'ember#index'

#GET 	      /photos 	        index 	  display a list of all photos
#GET 	      /photos/new 	    new 	    return an HTML form for creating a new photo
#POST 	    /photos 	        create 	  create a new photo
#GET 	      /photos/:id 	    show 	    display a specific photo
#GET 	      /photos/:id/edit 	edit 	    return an HTML form for editing a photo
#PATCH/PUT 	/photos/:id 	    update 	  update a specific photo
#DELETE 	  /photos/:id 	    destroy 	delete a specific photo


  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
