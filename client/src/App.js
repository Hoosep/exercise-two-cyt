import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Icon, Button, message, InputNumber, Select } from 'antd';
import { NearNumbers } from './services';
import './App.css';

let id = 0;
const { Option } = Select;

class App extends Component {
  state = {
    data: '',
    responseOK: false,
    numbers: []
  }

  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length >= 12){
      message.warning('You just need to add twelve numbers.');
      return;
    }
    
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (/*keys.length < 12*/ false) {
      message.warning('You must add twelve random numbers.');
    } else {
      form.validateFields((err, values) => {
        if (!err) {
          const { names:numbers, selectNumbers } = values;
          
          return NearNumbers(numbers, selectNumbers)
          .then( data => {
            this.setState({
              data,
              responseOK: true
            })
          });
        }
      });
    }
  };

  handleOnChange = e => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      const { names:numbers } = values;
      this.setState({
        numbers
      })
    })
  }

  render() {
    const { data, responseOK, numbers } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    
    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 12, offset: 6 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(formItemLayout)}
        required={false}
        key={k}
        className="input-numbers"
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Add a number, please.",
            },
          ],
        })(<InputNumber  placeholder={`Number ${index + 1}`} style={{ width: '90%', marginRight: 8 }} />)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));

    const optionSelect = numbers.map((v, index) => (
      <Option value={v} key={`option${index}`}>{v}</Option>
    ));

    return (
      <Fragment>
        <Row type="flex" justify="center" align="middle">
          <Col span={24}>
            <h1 className="text-center">Add twelve random numbers.</h1>
          </Col>
          <Col span={24}>
            <Form onSubmit={this.handleSubmit} onChange={this.handleOnChange}>
              {formItems}
              <Form.Item {...formItemLayout}>
                <Button block type="dashed" onClick={this.add} >
                  <Icon type="plus" /> Add number.
                </Button>
              </Form.Item>
              <Form.Item {...formItemLayout}>
                {
                  getFieldDecorator(`selectNumbers`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      {
                        required: true,
                        message: "Select a number, please.",
                      },
                    ],
                  })(
                    <Select placeholder="Select a number" style={{ width: '100%' }} >
                      {optionSelect}
                    </Select>
                  )
                }
              </Form.Item>
              <Form.Item {...formItemLayout}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        {
          responseOK
          ? <Row type="flex" justify="center" align="middle">
              <Col span={24} className="text-center">
                <h3>Your number selected: {data.selectNumber}</h3>
              </Col>
              <Col span={24} className="text-center">
                <strong>Previous number:</strong> {data.prevNumber}
              </Col>
              <Col span={24} className="text-center">
                <strong>Next number:</strong> {data.nextNumber}
              </Col>
            </Row>
          : null
        }
      </Fragment>
    );
  }
}

const WrappedApp = Form.create({ name: 'dynamic_form_item' })(App);

export default WrappedApp;