import * as React from "react";
import '../App.scss';
import Item, {ItemProps} from './item';
import io from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';
import {SocketService} from '../SocketService';
const ENDPOINT = "http://codefusion.online:3000";

export interface Props {
    error: null,
    isLoaded: boolean,
    showForm: boolean,
    items: ItemProps[]
    value: any,
    socket: SocketService
}

class List extends React.Component<any, Props> {

    constructor(props: any) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            showForm: false,
            items: [],
            value: null,
            socket: new SocketService()
        };
        this.state.socket.init();
        this.fieldChanged = this.fieldChanged.bind(this);
        this.addButton = this.addButton.bind(this);
    }

    showForm = () => {
        this.setState({
            showForm: true
        })
    };

    hideForm = () => {
        this.setState({
            showForm: false
        })
    };

    handleDelete = (data : any) => {
        this.state.socket.deleted(data)
    };

    fieldChanged = (event: { target: { value: any; }; }) => {
        this.setState({value: event.target.value});
    };

    addButton = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        console.log(this.state.value);
        if(this.state.value){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: this.state.value })
            };
            fetch('http://interview-api.codefusion.online/api/items', requestOptions)
                .then(response => response.json())
                .then(data => {
                    // APPEND THE ADDED ITEM TO THE ARRAY
                    this.state.socket.added(data)
                });
        }
    };

    componentDidMount(): void {
        fetch("http://interview-api.codefusion.online/api/items")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });

                    const observable = this.state.socket.onAdd();
                    const observableDelete = this.state.socket.onDelete();
                    // subscribe to observable
                    observable.subscribe((m: any) => {
                        let newArray = this.state.items.slice();
                        newArray.push(m);
                        this.setState({ items: newArray });
                    });

                    observableDelete.subscribe((m: any) => {
                        console.log(m)
                        let newArray = this.state.items.slice();
                        const idToRemove = newArray.findIndex(el => el.id === m.deleted);
                        newArray.splice(idToRemove, 1);
                        this.setState({items: newArray})
                    });

                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render(){
        const { error, isLoaded, items } = this.state;

        let loading;
        let listItems;
        let errorMessage;
        let form;

        if(!isLoaded){
            loading = <div>Loading...</div>
        }else{
            loading = null
        }

        form = <div>
            <form className={'addForm'} onSubmit={this.addButton}>
                <input value={this.state.value} onChange={this.fieldChanged} type="text" placeholder={'Type your to-do item here'}/>
                <button className={'btn'} type='submit'>Add</button>
            </form>
        </div>;

        if(error){
            errorMessage = <div>Error: {error}</div>
        }else{
            errorMessage = null
        }

        if(!items.length && isLoaded){
            listItems =  <div className={'emptyState'}>
                <h4>You have no items on your list</h4>
            </div>
        }else{
            listItems = items.map((item, index) => {
                return (<Item id={item.id} name={item.name} onDelete={this.handleDelete} key={item.name + '-' + index}/>)
            })
        }

        return (
            <div>
                {loading}
                {errorMessage}
                {form}
                <div className={'itemContainer'}>{listItems}</div>
            </div>
        )

    }

}

export default List
