import * as React from "react";
import {SocketService} from '../SocketService';

export interface ItemProps {
    id: number
    name: string,
    description: string,
    dateCreated: Date
    dateUpdated: Date,
}

class Item extends React.Component<any, ItemProps> {

    deleteItem = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
            fetch('http://interview-api.codefusion.online/api/items/' + this.props.id + '/delete')
                .then((response: { json: () => any; }) => response.json())
                .then((data: any) => {
                    this.props.onDelete(data)
                });

    };

    render(){
        return (
            <div className={'singleItem'}>
                <p>{this.props.name}</p>
                <button type={'button'} className={'btn-inline'} onClick={this.deleteItem}> Delete</button>
            </div>)
    }

}

export default Item
