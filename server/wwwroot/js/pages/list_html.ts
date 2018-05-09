import { IIncoming } from "../../../server/apiInstances/incomingApi";

const ListContainer = () => `<div id="listPageId">
    <div class="date" id="listDate">
        <span class="time" id="mainDateSpan"></span>
    </div>

    <div class="list" id="listBlock"></div>

</div>`;


const getIncomingRow = (incoming: IIncoming) => `<a href="#payment,id:${incoming.id}"><div class="listIncomingRow" data-id="${incoming.id}">
        <div class="icon"> ${ incoming.typeId}</div>
        <div class="text">${ incoming.comment}</div>
        <div class="value">${ incoming.value}</div>
    </div></a>`;

const getDateRow = (dateString: string) => `<div class="listRowDate">${ dateString }</div>`;

const getIncomingListRow = (incoming: IIncoming[], date: Date, total: number) => {
    return `<div class="listRow">
        ${ getDateRow(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`) }
        ${ incoming.reduce((prev, next) => prev + getIncomingRow(next), "") }
        <div class="total">${ total }</div>
    </div>`;
};

export { getIncomingListRow };

export default ListContainer;