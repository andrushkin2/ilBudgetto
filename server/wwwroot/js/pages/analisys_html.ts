import { overviewIcon, barChartIcon, barsChartIcon, savingDiagramIcon, expensesDiagramIcon, incomeGraphIcon, pieChartColorfullIcon } from "../icons";

const AnalisysContainer = () => `<div id="analisysPageId">
    <div class="row">
        <a class="itemLink">
            <div class="item">
                <div class="itemIcon">${ overviewIcon() }</div>
                <div class="itemText">Overview</div>
            </div>
        </a>
        <a class="itemLink">
            <div class="item">
                <div class="itemIcon">${ barChartIcon() }</div>
                <div class="itemText">Daily surplus</div>
            </div>
        </a>
        <a class="itemLink" href="#trendsGraph">
            <div class="item">
                <div class="itemIcon">${ barsChartIcon() }</div>
                <div class="itemText">Trends</div>
            </div>
        </a>
        <a class="itemLink">
            <div class="item">
                <div class="itemIcon">${ savingDiagramIcon() }</div>
                <div class="itemText">Savings</div>
            </div>
        </a>
        <a class="itemLink" href="#expensesGraph">
            <div class="item">
                <div class="itemIcon">${ expensesDiagramIcon() }</div>
                <div class="itemText">Expenses</div>
            </div>
        </a>
        <a class="itemLink" href="#incomeGraph">
            <div class="item">
                <div class="itemIcon">${ incomeGraphIcon() }</div>
                <div class="itemText">Income</div>
            </div>
        </a>
        <a class="itemLink" href="#fixed">
            <div class="item">
                <div class="itemIcon">${ pieChartColorfullIcon() }</div>
                <div class="itemText">Fixed costs</div>
            </div>
        </a>
        <a class="itemLink">
            <div class="item empty">
                <div class="itemIcon"></div>
                <div class="itemText"></div>
            </div>
        </a>
    </div>
</div>`;


export default AnalisysContainer;