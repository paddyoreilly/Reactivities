import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header } from "semantic-ui-react";
import MyTextArea from "../../app/common/form/MyTextArea";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';

interface Props {
    setEditMode: (editMode: boolean) => void;
}

export default observer(function ProfileEditForm({ setEditMode }: Props) {
    const { profileStore: { profile, updateProfile } } = useStore();

    return (
        <Formik
            initialValues={{ displayName: profile?.displayName, bio: profile?.bio }}
            onSubmit={values => updateProfile(values).then(() => { setEditMode(false); })}
            validationSchema={Yup.object({
                displayName: Yup.string().required("Display name is required").matches(/^'?\p{L}+(?:[' ]\p{L}+)*'?$/u, 'No special characters')
            })}
        >
            {({ isSubmitting, isValid, dirty }) => (
                <Form className="ui form" autoComplete='off'>
                    <Header content='Display Name' sub color='teal' />
                    <MyTextInput name='displayName' placeholder='Display Name' />
                    <Header content='Bio' sub color='teal' />
                    <MyTextArea rows={10} name="bio" placeholder="Bio" />
                    <Button
                        positive
                        type="submit"
                        loading={isSubmitting}
                        content='Update Profile'
                        floated="right"
                        disabled={!isValid || !dirty}
                    />
                </Form>
            )}
        </Formik >
    )
})