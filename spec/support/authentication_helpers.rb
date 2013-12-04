module AuthenticationHelpers
  ROLES = [:manager, :employee, :guest, :buyer, :receiver]

  def set_current_user(user, include_session = true)

    if include_session
      if defined?(session)
        session['cas'] = { 'user' => user.try(:username), 'extra_attributes' => {} }
      end
    end

    Authorization.current_user = user
  end

  # for integration tests
  def login_as(user)
    visit root_path(login: true)
    fill_in 'username', with: user.try(:username)
    fill_in 'password', with: 'bogus password'
    click_button 'Login'
  end

  def has_content(*text_array)
    text_array.each do |text|
      expect(page).to have_content text
    end
  end
  def does_not_have_content(*text_array)
    text_array.each do |text|
      expect(page).to_not have_content text
    end
  end

end
