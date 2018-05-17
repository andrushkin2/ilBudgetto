const OverviewContainer = () => `<div id="overviewGraphPageId">
    <div class="box">
        <div class="column right">
            <div class="green">Income</div>
            <div>Fixed</div>
            <div>Variable</div>

            <div class="row"></div>

            <div class="orange">Expenses</div>
            <div>Fixed</div>
            <div>Variable</div>

            <div class="row"></div>

            <div class="savings">Savings</div>
        </div>

        <div class="column left">
            <div id="overviewIncomeAll" class="green">0</div>
            <div id="overviewIncomeFixed">0</div>
            <div id="overviewIncomeVariable">0</div>

            <div class="row"></div>

            <div class="orange" id="overviewExpensesAll">0</div>
            <div id="overviewExpensesFixed">0</div>
            <div id="overviewExpensesVariable">0</div>

            <div class="row"></div>

            <div class="savings" id="overviewSavings">0</div>
        </div>
    </div>
    <div class="box line"></div>
    <div class="box">
        <div class="column right">
            <div class="leftBudget">Left budget</div>
        </div>
        <div class="column left">
            <div id="overviewLeftBunget" class="leftBudget">0</div>
        </div>
    </div>
</div>`;


export default OverviewContainer;