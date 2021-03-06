import React, { Component } from "react";
import {Card,  Table} from "antd";
import axios from 'axios';
const BASE_URL=process.env.REACT_APP_API_URL


function handleAdmin(data){
    axios.post(BASE_URL+'users/superadmin/makeUser',data).then(window.location.reload(false));
   
}

class listAdmins extends Component {
    constructor() {
        super();

        this.state = {
            
            data: []
        }

       
    }
     columns = [
        {
          title: 'nom',
          dataIndex: 'nom',
          key: 'nom',
          render: text => <span className="gx-link">{text}</span>,
        },
        {
          title: 'prenom',
          dataIndex: 'prenom',
          key: 'prenom',
        },
        {
          title: 'email',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
          
            <span className="gx-link"onClick={() => handleAdmin(record)}>Make a simple user</span>
           
          </span>
          ),
        }
      ];
      

    componentDidMount() {
        axios.get(BASE_URL+'users/superadmin/alladmins') //the api to hit request
            .then((response) => {
                const data = response.data.AdminsList.map((Admins) => ({
                    nom: Admins.nom,
                    prenom: Admins.prenom,
                    email:Admins.email
                }));

                this.setState({
                    data
                });
                
            });
    }

    render() {
        
    return (
        <Card title="Liste des admins">
          <Table className="gx-table-responsive" columns={this.columns} dataSource={this.state.data} pagination={{pageSize: 5}}/>
        </Card>
      );
    }
    
}

  
export default listAdmins;
