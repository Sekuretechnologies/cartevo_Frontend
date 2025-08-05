import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { carteSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CButton from "../../CButton";

const CarteForm = () => {
  const form = useForm<z.infer<typeof carteSchema>>({
    resolver: zodResolver(carteSchema),
    defaultValues: {
      Achat_de_carte: false,
      Recharges_de_carte: false,
      Retraits_de_carte: false,
    },
  })

  function onSubmit(data: z.infer<typeof carteSchema>) {
    console.log(JSON.stringify(data));
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="space-y-4 ">
          <FormField
            control={form.control}
            name="Achat_de_carte"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5 flex justify-between items-center w-full mr-4">
                  <FormLabel className="text-xs font-semibold">Inscriptions</FormLabel>
                  <FormLabel className="text-xs font-semibold">Activé</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-readonly
                    className="data-[state=checked]:bg-[#18BC7A]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Recharges_de_carte"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5 flex justify-between items-center w-full mr-4">
                  <FormLabel className="text-xs font-semibold">Recharges de solde</FormLabel>  
                  <FormLabel className="text-xs font-semibold">Activé</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={true}
                    onCheckedChange={field.onChange}
                    aria-readonly
                    className="data-[state=checked]:bg-[#18BC7A]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Retraits_de_carte"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5 flex justify-between items-center w-full mr-4">
                  <FormLabel className="text-xs font-semibold">Retraits de solde</FormLabel>  
                  <FormLabel className="text-xs font-semibold">Activé</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-readonly
                    className="data-[state=checked]:bg-[#18BC7A]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="Cout_du_dollar"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-between">  
              <FormLabel className="text-xs text-gray-300">Frais de recharge</FormLabel>
              <FormControl>
                <Input type="text" className=" h-10 text-gray-700 border-none bg-gray-100 rounded-md outline-none px-3" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Prix_de_la_carte"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-between">
              <FormLabel className="text-xs text-gray-300">Frais de retraits</FormLabel>
              <FormControl>
                <Input type="text" className=" h-10 text-gray-700 border-none bg-gray-100 rounded-md outline-none px-3" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Recharge"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-between">
              <FormLabel className="text-xs text-gray-300">Rémunération parrainage</FormLabel>
              <FormControl>
              <Input type="text" className=" h-10 text-gray-700 border-none bg-gray-100 rounded-md outline-none px-3" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Retraits"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-between">
              <FormLabel className="text-xs text-gray-300">Rémunération parrainage</FormLabel>
              <FormControl>
              <Input type="text" className=" h-10 text-gray-700 border-none bg-gray-100 rounded-md outline-none px-3" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Echec_de_paiement"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-between">
              <FormLabel className="text-xs text-gray-300">Rémunération parrainage</FormLabel>
              <FormControl>
              <Input type="text" className=" h-10 text-gray-700 border-none bg-gray-100 rounded-md outline-none px-3" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-wrap items-center gap-y-4 w-[270px]">
          <CButton
          type="submit"
          text={"Appliquer les modifications"}
          btnStyle={"green"}
          width="100%"/>
          <CButton
          text={"Retablir"}
          btnStyle={"outlineDark"}
          width="100%"/>
        </div>
      </form>
    </Form>
  )
}

export default CarteForm;
