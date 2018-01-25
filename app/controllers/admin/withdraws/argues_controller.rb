module Admin
  module Withdraws
    class ArguesController < ::Admin::Withdraws::BaseController
      load_and_authorize_resource :class => '::Withdraws::Argue'

      def index
        start_at = DateTime.now.ago(60 * 60 * 24)
        @one_argues = @argues.with_aasm_state(:accepted).order("id DESC")
        @all_argues = @argues.without_aasm_state(:accepted).where('created_at > ?', start_at).order("id DESC")
      end

      def show
      end

      def update
        @argue.process!
        redirect_to :back, notice: t('.notice')
      end

      def destroy
        @argue.reject!
        redirect_to :back, notice: t('.notice')
      end
    end
  end
end
