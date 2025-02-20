import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Typography, } from '@material-tailwind/react';
import { AuthHeader } from './auth.Comps/AuthHeader'
import { ProfileForm } from './auth.Comps/ProfileForm';
import { AssistanceLevel, ProfileDTO } from '../../../../domain/entities/Profile';
import { ConfirmModal } from '../../common/ConfirmModal';
import DI from '../../../../di/ioc';
import { useUserStore } from '../../../../application/stores/user.store';
import { Skeleton } from '../../common/Skeleton';
import { User } from '../../../../domain/entities/User';
import { MailSubscriptions } from '../../../../domain/entities/Profile';
import { AddressDTO } from '../../../../infrastructure/DTOs/AddressDTO';
import { Address } from '../../../../domain/entities/Address';
import { LogOutButton } from '../../common/LogOutBtn';

export default function ProfileCreatePage() {
    const { setUserProfile } = useUserStore()
    const navigate = useNavigate();
    const user: User = useUserStore((state) => state.user);
    const [assistance, setAssistance] = useState<string>(AssistanceLevel.LEVEL_0 as string)
    const [address, setAddress] = useState<AddressDTO>(new AddressDTO())
    const [mailSub, setMailSub] = useState<string>(MailSubscriptions.SUB_1 as string)
    const [open, setOpen] = useState(false);
    const postProfile = async (data: ProfileDTO) => await DI.resolve('postProfileUseCase').execute(data, address)

    useEffect(() => {
        if (!user) navigate("/signup?msg=Vous devez avoir un compte pour accéder à cette page")
        if (user.Profile) navigate("/msg?msg=Vous avez déjà un profil")
    }, [user])

    /// FORMIK SCHEMA
    const formSchema = object({
        firstName: string().required("Le prémon est obligatoire").min(2, "minmum 2 lettres"),
        lastName: string().required("Le Nom est obligatoire").min(2, "minmum 2 lettres"),
        phone: string().required("Le Numéro est obligatoire").min(10, "minmum 2 caractères").max(14, "maxmum 14 caractères").matches(/^\+33/, "Le Numéro doit commencer par +33"),
        Address: object({ city: string().required("Ville est obligatoire"), zipcode: string().required("Code postal est obligatoire") }),
        mailSub: string()
    })

    /// FORMIK SUBMIT
    const formik = useFormik({
        initialValues: new ProfileDTO(),
        validationSchema: formSchema,
        onSubmit: async values => {
            formik.values = values;
            formik.values.assistance = assistance;
            formik.values.mailSub = mailSub;
            setOpen(true)
        }
    })
    const post = async () => {
        const { ...rest } = formik.values;
        const updateData = { ...rest }
        const updated = await postProfile(updateData)
        if (updated) {
            setUserProfile(updated)
            navigate("/");
            setOpen(false)
        }
    }

    useEffect(() => { formik.values.Address = address as Address }, [address])

    return (
        <div className="Body gray flex">
            <ConfirmModal
                open={open}
                handleOpen={() => setOpen(false)}
                handleCancel={() => { setOpen(false) }}
                handleConfirm={async () => { await post() }}
                title={"Confimrer la modification"}
                element={(JSON.stringify(formik.values, null, 2).replace(/,/g, "<br>").replace(/"/g, "").replace(/{/g, " : ")).replace(/}/g, "")} />
            <div className="w-respLarge flex-col flex justify-between ">
                <AuthHeader />
                <div className="flex justify-between items-center pb-3">
                    <Typography
                        color="blue-gray"
                        className='w-resp px-4 flex justify-center pb-2'>
                        Bienvenue, veuillez remplir votre profil pour pouvoir utiliser Collect'if
                    </Typography>
                    <LogOutButton />
                </div>
            </div>
            {!user || user.Profile ?
                <Skeleton /> :
                <ProfileForm
                    formik={formik}
                    setAssistance={setAssistance}
                    setAddress={setAddress}
                    setMailSub={setMailSub} />}
        </div >
    )
}