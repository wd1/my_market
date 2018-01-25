module Admin
  module Withdraws
    class BitcoincashsController < ::Admin::Withdraws::BaseController
      load_and_authorize_resource :class => '::Withdraws::Bitcoincash'

      def index
        start_at = DateTime.now.ago(60 * 60 * 24)
        @one_bitcoincashs = @bitcoincashs.with_aasm_state(:accepted).order("id DESC")
        @all_bitcoincashs = @bitcoincashs.without_aasm_state(:accepted).where('created_at > ?', start_at).order("id DESC")
      end

      def show
      end

      def update
        @bitcoincash.process!
        redirect_to :back, notice: t('.notice')
      end

      def destroy
        @bitcoincash.reject!
        redirect_to :back, notice: t('.notice')
      end
    end
  end
end
