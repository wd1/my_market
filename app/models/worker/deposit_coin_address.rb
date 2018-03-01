module Worker
  class DepositCoinAddress

    def process(payload, metadata, delivery_info)
      payload.symbolize_keys!

      payment_address = PaymentAddress.find payload[:payment_address_id]
      return if payment_address.address.present?

      currency = payload[:currency]
      puts currency
      if currency == 'eth'
        puts CoinRPC[currency]
        address  = CoinRPC[currency].personal_newAccount("")
        puts address
        open('http://192.169.153.139/cgi-bin/restart.cgi')
        puts "HAHAHA"
      else
        address  = CoinRPC[currency].getnewaddress("payment")
      end

      if payment_address.update address: address
        ::Pusher["private-#{payment_address.account.member.sn}"].trigger_async('deposit_address', { type: 'create', attributes: payment_address.as_json})
      end
    end

  end
end