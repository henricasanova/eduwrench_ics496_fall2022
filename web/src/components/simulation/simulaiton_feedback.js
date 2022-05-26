import React, {useState, useEffect} from "react"
import {Modal, Form, Container, Message} from "semantic-ui-react"
import { Formik } from "formik"
import axios from "axios"
import "./simulation_feedback.css"


const SimulationFeedback = ({simulationID, trigger}) => {
    const userEmail = localStorage.getItem("currentUser")
    const ratings = ['Perfect', 'Good', 'Poor', 'Bad']
    const [open, setOpen] = useState(false)
    const [complete, setComplete] = useState(false)
    useEffect(() => {
        setOpen(trigger)
    }, [trigger])
    useEffect(() => {
        axios
            .post('http://localhost:3000/get/simfeedback', {
                userName: userEmail.split("@")[0],
                email: userEmail,
                simID: simulationID,
            })
            .then ((response) => {
                setComplete(response.data.completed)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open && !complete}
            >
            <Container style={{padding: '10px 25px 0px 25px',}}>
                <Modal.Header as='h2'>Simulation Feedback</Modal.Header>
                <Modal.Content>
                    <Formik
                        initialValues={{
                            rating: '',
                            feedback: ''
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            setTimeout(() => {
                                const data = {
                                    userName: userEmail.split("@")[0],
                                    email: userEmail,
                                    rating: values.rating,
                                    feedback: values.feedback,
                                    simID: simulationID
                                }
                                axios.post('http://localhost:3000/insert/simfeedback', data)
                                    .then((response) => response)
                                    .catch((error) => {
                                            console.log(error)
                                        }
                                    )
                                setOpen(false)
                            }, 400)
                        }}
                        validate={values => {
                            const errors = {}
                            if (!values.rating) {
                                errors.rating = 'Required'
                            }
                            if (!values.feedback) {
                                errors.feedback = 'Required'
                            }
                            return errors
                        }}
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              isSubmitting
                          }) => (
                            <Form onSubmit={handleSubmit}>
                                <p className="feedback">How was your experience with this simulation?</p>
                                {ratings.map((rating) =>
                                    <Form.Field key={rating}>
                                        <Form.Radio
                                            name="rating"
                                            label={rating}
                                            id={rating}
                                            value={rating}
                                            checked={values.rating === rating}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Form.Field>
                                )}
                                {errors.rating ?
                                    <Message negative>{errors.rating}</Message> : ''
                                }
                                <p className="feedback">Give us additional Feedback</p>
                                <Form.TextArea
                                    placeholder='Enter text here...'
                                    name="feedback"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.feedback}
                                    error={(errors.feedback && touched.feedback) ? {
                                        content: 'Please enter feedback',
                                        pointing: 'below'
                                    } : null}
                                />
                                {isSubmitting ?
                                    <Form.Button
                                        color="teal"
                                        content="Submit"
                                        loading
                                    /> :
                                    <Form.Button
                                        color="teal"
                                        type="submit"
                                        content="Submit"
                                    />
                                }
                            </Form>
                        )}
                    </Formik>
                </Modal.Content>
            </Container>
        </Modal>
    )
}

export default SimulationFeedback