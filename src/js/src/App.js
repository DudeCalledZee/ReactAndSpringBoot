import React, { Component } from 'react';
import Container from './Container';
import Footer from './Footer';
import './App.css';
import {getAllStudents} from './client';
import { LoadingOutlined } from '@ant-design/icons';
import AddStudentForm from './forms/AddStudentForm';
import { errorNotification } from './Notification';
import {
  Table, 
  Avatar,
  Spin,
  Modal,
  Empty, 
} from 'antd';

const getIndicatorIcon = () => <LoadingOutlined style={{ fontSize: 24 }} spin />;


class App extends Component {

  state = {
    students: [],
    isFetching: false,
    isAddStudentModalVisable: false,
    isCoursesClicked: false
  }

  componentDidMount () {
    this.fetchStudents();
  }

  openAddStudentModal = () => this.setState({isAddStudentModalVisable: true})

  closeAddStudentModal = () => this.setState({isAddStudentModalVisable: false})

  coursesClicked = () => this.setState({isCoursesClicked: true})

  fetchStudents = () => {
    this.setState({
      isFetching: true
    });
    getAllStudents()
    .then(res => res.json()
    .then(students => {
      console.log(students);
      this.setState({
        students,
        isFetching: false
      });
    })).catch(error => {
      console.log(error.error)
      const description = error.error.httpStatus;
      const message = error.error.message;
      errorNotification(message, description);
      this.setState({isFetching:false});
    });
  }

  render() {

    const {students, isFetching, isAddStudentModalVisable} = this.state;
    
    const commonElements = () => (
      <div>
        <Modal 
          title='Add new student'
          visible={isAddStudentModalVisable}
          onOk={this.closeAddStudentModal}
          onCancel={this.closeAddStudentModal}
          width={1000}>
            <AddStudentForm 
              onSuccess={() => {
                this.closeAddStudentModal();
                this.fetchStudents();
              }}
              onFailure = { (error) => {
                const description = error.error.httpStatus;
                const message = error.error.message;
                console.log(JSON.stringify(error))
                errorNotification(message, description)
              }}
            />
        </Modal>
        <Footer 
          numberOfStudents = {students.length}
          handleAddStudentClickEvent={this.openAddStudentModal}
        />
      </div>
    )

    if(isFetching) {
      return (
        <Container>
          <Spin indicator={getIndicatorIcon()}/>
        </Container>
      );
    }
let columns;
    if (students && students.length){

       columns = [
        {
          title: '',
          key: 'avatar',
          render: (text, student) => (
            <Avatar size='large'>
              {
                `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`
              }
            </Avatar>
          )
        },
        {
          title: 'Student Id',
          dataIndex: 'studentId',
          key: 'studentId',
        },
        {
          title: 'First Name',
          dataIndex: 'firstName',
          key: 'firstName',
        },
        {
          title: 'Last Name',
          dataIndex: 'lastName',
          key: 'lastName',
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Gender',
          dataIndex: 'gender',
          key: 'gender',
        }    
    ];

return (
      <Container>
        <Table 
          style={{marginBottom: '70px'}}
          dataSource={students} 
          columns={columns} 
          pagination={false}
          rowKey='studentId'/>
          {commonElements()}
      </Container>
      );
  }

    return  (
      <Container>
        <Empty description={
          <h1>No Students Found</h1>
        }/>
        {commonElements()}
      </Container>
      )
  }
}

export default App;
