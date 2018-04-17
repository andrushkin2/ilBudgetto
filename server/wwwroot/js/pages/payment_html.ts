const PaymentContainer = () => `<div id="paymentPageId">
    <div class="form">
        <div class="formFeild">
            <label class="label">Value:</label>
            <input id="paymentValue" class="input" value="0" type="number"/>
            <select id="paymentCurrency" class="select" value="$">
                <option value="$">$</option>
            </select>
        </div>
        <div class="formFeild">
            <label class="label">Comment:</label>
            <input id="paymentComment" class="input" value="" type="text"/>
        </div>
        <div class="formFeild">
            <label class="label">Tags:</label>
            <input id="paymentTag" class="input" value="" type="text"/>
        </div>
        <div class="formFeild">
            <label class="label">Date:</label>
            <input id="paymentDate" class="input" value="" type="text"/>
        </div>
        <div class="buttons">
            <button class="button cancel" id="paymentCancel">Cancel</button>
            <button class="button apply" id="pyamentApply">Apply</button>
        </div>
    </div>
</div>`


export default PaymentContainer;