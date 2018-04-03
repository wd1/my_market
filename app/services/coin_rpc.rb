require 'net/http'
require 'net/http/digest_auth'
require 'uri'
require 'json'

class CoinRPC

  class JSONRPCError < RuntimeError; end
  class ConnectionRefusedError < StandardError; end

  def initialize(uri)
    @uri = URI.parse(uri)
  end

  def self.[](currency)
    c = Currency.find_by_code(currency.to_s)
    if c && c.rpc
      # puts c[:handler]
      name = c[:handler] || 'BTC'
      "::CoinRPC::#{name}".constantize.new(c.rpc)
    end
  end

  def method_missing(name, *args)
    handle name, *args
  end

  def handle
    raise "Not implemented"
  end
  
  class BTC < self
    def handle(name, *args)
      post_body = { 'method' => name, 'params' => args, 'id' => 'jsonrpc' }.to_json
      if(name == 'wallet_propose')
        post_body = { 'method' => name, 'params' => [{"passphrase": "rBK32aK3ffMExgp12KXk3XVoVtHKLtSbgM"}]}.to_json
      end
      resp = JSON.parse( http_post_request(post_body) )
      raise JSONRPCError, resp['error'] if resp['error']
      result = resp['result']
      result.symbolize_keys! if result.is_a? Hash
      result
    end
    def http_post_request(post_body)
      http    = Net::HTTP.new(@uri.host, @uri.port)
      request = Net::HTTP::Post.new(@uri.request_uri)
      request.basic_auth @uri.user, @uri.password
      request.content_type = 'application/json'
      request.body = post_body
      http.request(request).body
      # digest_auth = Net::HTTP::DigestAuth.new
      # h = Net::HTTP.new(@uri.host, @uri.port)
      # req = Net::HTTP::Post.new(@uri.request_uri)
      # res = h.request req
      # auth = digest_auth.auth_header(@uri, res['www-authenticate'], 'POST')
      # req = Net::HTTP::Post.new(@uri.request_uri)
      # req.add_field 'Authoriztion', auth
      # h.request(req).body
    rescue Errno::ECONNREFUSED => e
      raise ConnectionRefusedError
    end

    def safe_getbalance
      begin
        getbalance
      rescue
        'N/A'
      end
    end
  end

  class ETH < self
    def handle(name, *args)
      post_body = {"jsonrpc" => "2.0", 'method' => name, 'params' => args, 'id' => '1' }.to_json
      resp = JSON.parse( http_post_request(post_body) )
      raise JSONRPCError, resp['error'] if resp['error']
      result = resp['result']
      result.symbolize_keys! if result.is_a? Hash
      result
    end
    def http_post_request(post_body)
      puts "ABABABABAB"
      puts @uri.host
      puts @uri.port
      http    = Net::HTTP.new(@uri.host, @uri.port)
      request = Net::HTTP::Post.new(@uri.request_uri)
      request.basic_auth @uri.user, @uri.password
      request.content_type = 'application/json'
      request.body = post_body
      puts request.body
      puts request
      http.request(request).body
    rescue Errno::ECONNREFUSED => e
      raise ConnectionRefusedError
    end

    def safe_getbalance
      begin
        (open('http://192.169.153.139/cgi-bin/total.cgi').read.rstrip.to_f)
      rescue
        'N/A'
      end
    end
  end
  
  
end