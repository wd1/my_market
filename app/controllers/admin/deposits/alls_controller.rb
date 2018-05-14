
module Admin
  module Deposits
    class AllsController < ::Admin::Deposits::BaseController
      load_resource :class => '::Deposits::All'

      def index
        start_at = DateTime.now.ago(60 * 60 * 24 * 365)
        @alls = @alls.includes(:member).
          where('created_at > ?', start_at).
          order('id DESC').page(params[:page]).per(20)
      end

      def update
        @all.accept! if @all.may_accept?
        redirect_to :back, notice: t('.notice')
      end
    end
  end
end
