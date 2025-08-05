"use client"
import Layout from '@/components/shared/Layout';
import Title from '@/components/shared/Title';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { FaLock, FaX } from 'react-icons/fa6';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { adminSchema, detailsSchema } from "@/validation/FormValidation";
import ActiveYesNo from '@/components/shared/ActiveYesNo';
import LabelWithBadge from '@/components/shared/LabelWithBadge';
import { FaCheck } from 'react-icons/fa';
import CButton from '@/components/shared/CButton';


const Edit = ({ params }: { params: { id: string} }) => {
  const id = params.id;

  const form = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      email: "abc@@123.xyz",
      phone: "1234567890",
    },
  });
  
  const onSubmit = (data: z.infer<typeof detailsSchema>) => {
    console.log(data);
  };

  return (
    <Layout
      title={"Vérifications KYC"}
      backLink={'/kyc'}
    >
      
    <section className="flex justify-start items-start">

      <div className="pr-6 py-3 flex-1 w-[680px]">
        
        <Title title="Informations de verification d'identité de l'utilisateur" subtitle="liste en temps réel des dernieres transactions effectuées avec les cartes" />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-3 mt-5  ">
            <div className="w-full flex flex-col gap-7">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Type de Pièce d'identité`}</FormLabel>
                    <FormControl>
                      <Input className="px-6 text-gray-900 font-normal bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Numéro unique de Pièce d'identité`}</FormLabel>
                    <FormControl>
                      <Input className="px-6 text-gray-900 font-normal bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              
              <div className="flex justify-between items-center gap-3 mb-5">
                <figure>
                  <figcaption className="text-gray-900 text-sm font-semibold mb-2">{`Photo pièce d'identité (recto)`}</figcaption>
                  <Image
                    src="/assets/group1.png"
                    alt="group1"
                    width={225}
                    height={225}
                  />
                </figure>
                <figure>
                  <figcaption className="text-gray-900 text-sm font-semibold mb-2">{`Photo pièce d'identité (verso)`}</figcaption>
                  <Image
                    src="/assets/group3.png"
                    alt="group3"
                    width={225}
                    height={225}
                  />
                </figure>
                <figure>
                  <figcaption className="text-gray-900 text-sm font-semibold mb-2">{`Selfie avec pièce d'identité`}</figcaption>
                  <Image
                    src="/assets/group2.png"
                    alt="group2"
                    width={225}
                    height={225}
                  />
                </figure>
              </div>
            

              <Title 
              title="Informations personnelles de l'utilisateur"
              subtitle="liste en temps réel des dernieres transactions effectuées avec les cartes"
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Nom complet</FormLabel>
                    <FormControl>
                      <Input className="px-6 text-gray-900 font-normal bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-x-7 gap-y-7">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="abc@sekure.xyz" className="px-6 text-gray-900 font-normal bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Pays de résidence</FormLabel>
                    <FormControl>
                      <Input className="px-6 text-gray-900 font-thin bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Sexe</FormLabel>
                    <FormControl>
                      <Input className="px-6 text-gray-900 font-thin bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">téléphone</FormLabel>
                    <FormControl>
                      <Input className="px-6 text-gray-900 font-thin bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              </div>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Ville de residence</FormLabel>
                    <FormControl>
                      <Input className="px-6 text-gray-900 font-thin bg-gray-200" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      <div className="pl-10 py-3 w-[300px] grid grid-cols-1 gap-3">
        <div className="flex justify-between items-center w-full">
          <h1 className="flex-1 text-sm font-semibold text-gray-800">Créé depuis le</h1>
          <p className="text-gray-900 text-sm font-semibold">12/12/2021</p>
        </div>
        <div className="flex justify-between items-center w-full">
          <span className="text-gray-800 text-sm font-semibold">Etat du compte</span>
          <ActiveYesNo className={`text-xs`} isActive={true}/>
        </div>
        <div className="flex justify-between items-center w-full">
          <span className="text-gray-800 text-sm font-semibold">Etat du KYC</span>
          {/* <ActiveYesNo className={`text-xs`} isActive={true} label="En attente" color="#444"/> */}
          <LabelWithBadge className={`text-xs`} label="En attente" badgeColor="#444"/>
        </div>
        
        <div className="flex flex-col items-between justify-center gap-3 mt-2">
          <CButton 
          text={'Approuver'} 
          btnStyle={'green'}
          icon={<FaCheck />} 
          />
          <CButton 
          text={'Rejeter'} 
          btnStyle={'red'}
          icon={<FaX />} 
          />
          {/* <Button className="bg-[#33E89C] hover:bg-[#33E89C] rounded-full">
            <FaLock className="mr-2" />
            Approuver
          </Button>
          <Button className=" bg-[#F85D4B] hover:bg-[#F85D4B] rounded-full">
            <FaLock className="mr-2" />
            Approuver
          </Button> */}
        </div>
      </div>
    </section>
    </Layout>
  )
}

export default Edit
