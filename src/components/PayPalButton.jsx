<form action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post" target="_blank">
  <input type="hidden" name="cmd" value="_xclick" />
  <input type="hidden" name="business" value="jamesnmarg@live.com.au" />
  <input type="hidden" name="currency_code" value="USD" />
  <input type="hidden" name="item_name" value="Starcoin Purchase" />
  <input type="hidden" name="amount" value="6972" />
  <input type="hidden" name="custom" id="walletField" />
  <input type="hidden" name="notify_url" value="https://starcoin-exchange.onrender.com/paypal/notify" />

  <input
    type="text"
    placeholder="Enter your Starcoin wallet address"
    id="walletInput"
    required
    onChange={(e) => document.getElementById('walletField').value = e.target.value}
  />

  <button type="submit">Buy Now with PayPal</button>
</form>
