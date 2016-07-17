import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form';
import metadataEvaluator from './lib/metadataEvaluator';
import modelParser from './lib/modelParser';
import { Form } from 'react-bootstrap';

class AutoFormInternal extends Component {
    static propTypes = {
        fields: PropTypes.object.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        resetForm: PropTypes.func.isRequired,
        submitting: PropTypes.bool.isRequired,
        componentFactory: PropTypes.object.isRequired,
        entity: PropTypes.object.isRequired,
        layout: PropTypes.object,
        buttonBar: PropTypes.func.isRequired,
        fieldLayout: PropTypes.string
    };
    
    render() {
        //Fields: this is not the fields passed from AutoForm. This is generated by ReduxForm. This object has a property for each field. Each property contains all redux props for the given field
        let { componentFactory, fields, fieldMetadata, layout, handleSubmit, submitting, buttonBar, fieldLayout, values } = this.props;
        let modelProcessed = modelParser.process(values, fieldMetadata);
        let fieldMetadataEvaluated = metadataEvaluator.evaluate(fieldMetadata, modelProcessed, '', fields);

        let groupComponent = componentFactory.buildGroupComponent({
            component: layout.component,
            layout: layout,
            fields: fieldMetadataEvaluated,
            componentFactory: componentFactory
        });

        return (
            <div className="meta-form">
                <Form onSubmit={handleSubmit} horizontal={fieldLayout == 'inline'}>
                    { groupComponent }
                    { React.createElement(buttonBar, { submitting: submitting }) }
                </Form>
            </div>
        )
    }
}

export default reduxForm()(AutoFormInternal);