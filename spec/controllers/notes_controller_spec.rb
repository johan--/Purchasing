require 'spec_helper'

describe NotesController do

  { manager: :all,
    buyer: :all,
    receiver: :all,
    employee: :read,
    guest: :none
  }.each do |role, permission|

    describe "- Each CRUD method for #{role}" do
      let!(:user) do
        without_access_control do

          FactoryGirl.create(role)
        end
      end

      before (:each) do
        without_access_control do
          set_current_user user
          @note = FactoryGirl.create(:note)
          @note.update(user: user)
        end
      end

      it "- POST :create should be #{permission}" do
        post :create, :note => { text: 'Test Note' }

        if permission == :all || permission == :create
          expect(response).to be_success
          expect(response.content_type).to eq('application/json')
          expect(JSON.parse(response.body)['note']).to_not be_nil
        else
          expect(response).to_not be_success
          expect(Note.count).to eq(1)
        end
      end

      it "- PATCH :update should be #{permission}" do
        patch :update, id: @note.id, :note => { text: 'Test Note' }

        if permission == :all || permission == :create || permission == :update
          expect(response).to be_success
          expect(response.content_type).to eq('application/json')
          expect(JSON.parse(response.body)['note']).to_not be_nil

          @note.reload
          expect(@note.text).to eq('Test Note')
        else
          expect(response).to_not be_success
        end
      end

      it "- DELETE :destroy should be #{permission}" do
        delete :destroy, id: @note.id
        if permission == :all || permission == :create
          expect(response).to be_success
          expect(Note.find_by(id: @note.id)).to be_nil
          expect(response.content_type).to eq('application/json')
        else
          expect(response).to_not be_success
        end
      end
    end
  end

  describe 'You cannot modify a note belonging to someone else' do

    it 'You cannot modify another note as a Receiver' do
      without_access_control do
        set_current_user FactoryGirl.create(:receiver)
      end

      note = FactoryGirl.create(:note)

      without_access_control do
        other_user = FactoryGirl.create(:buyer)
        note.update(user: other_user)
      end

      expect{ patch :update, id: note.id, :note => { text: 'Test Note' } }.
        to raise_error
    end

    it 'You cannot modify another note as a Buyer' do
      without_access_control do
        set_current_user FactoryGirl.create(:buyer)
      end

      note = FactoryGirl.create(:note)

      without_access_control do
        other_user = FactoryGirl.create(:buyer)
        note.update(user: other_user)
      end

      expect{ patch :update, id: note.id, :note => { text: 'Test Note' } }.
        to raise_error
    end

    it 'You can modify another note as a Manager' do
      without_access_control do
        set_current_user FactoryGirl.create(:manager)
      end

      note = FactoryGirl.create(:note)

      without_access_control do
        other_user = FactoryGirl.create(:buyer)
        note.update(user: other_user)
      end

      patch :update, id: note.id, :note => { text: 'Test Note' }
      expect(response).to be_success
    end
  end
end
