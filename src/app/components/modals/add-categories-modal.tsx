"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import { getData, postData } from "@/services/resources";
import { style } from "@/theme";
import { Button as Boton } from "flowbite-react";
import { Category } from "@/services/products";
import { Alert } from "../alert/alert";
import { Loading } from "../loading/loading";

export interface AddCategoriesModalProps {
  onClose: () => void;
  isShow?: boolean;
}

export function AddCategoriesModal(props: AddCategoriesModalProps) {
  const { onClose, isShow } = props;
  const { register, handleSubmit, resetField, setFocus } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [isCategory, setIsCategory] = useState(true);
  const [message, setMessage] = useState<any>({});
  const [ categories, setCategories ] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false);


  const loadCategories = async () => {
        setIsLoading(true);
        try {
        const response = await getData(`categories`);
        setCategories(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        (async () => { await loadCategories() })();
        // eslint-disable-next-line
    }, []);


    
  const PrincipalCategories = categories.filter(item => item.category_type === "1");

  const onSubmit = async (data: any) => {
    data.category_type = isCategory ? 1 : 2;
    data.dependable = isCategory ? null : data.categoria
    data.pronoun = data.name;
    try {
      setIsSending(true)
      const response = await postData("categories", "POST", data);
      if (!response.message) {
        toast.success( "Categoría Agregada correctamente", { autoClose: 2000 });
        if (isCategory) loadCategories()
        resetField("name")
      } else {
        toast.error("Faltan algunos datos importantes!", { autoClose: 2000 });
      }
      setMessage(response);
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!", { autoClose: 2000 });
    } finally {
      setIsSending(false)
    }
  };

  useEffect(() => {
    setFocus('name', {shouldSelect: true})
  }, [setFocus, isShow, isCategory, onSubmit])


  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>Agregar nueva categoria</Modal.Header>
      <Modal.Body>

    { isLoading ? <Loading /> : <>

      <Boton.Group outline className="w-full">
        <Boton gradientDuoTone="cyanToBlue" fullSized={true} onClick={() => setIsCategory(true)} >
          Categoría
        </Boton>
        <Boton gradientDuoTone="cyanToBlue" fullSized={true} onClick={() => setIsCategory(false)} >
          Sub Categoría
        </Boton>
      </Boton.Group>

      <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >


      { !isCategory && 
      <div className="w-full md:w-full px-3 mb-4">
          <label htmlFor="categoria" className={style.inputLabel}>
            Categoria
          </label>
            <select
              defaultValue={PrincipalCategories[0]?.id}
              id="categoria"
              {...register("categoria")}
              className={style.input}
            >
              {PrincipalCategories.map((value: any) => {
                return (
                  <option key={value.id} value={value.id}>
                    {value.name}
                  </option>
                );
              })}
            </select>
        </div> }



            <div className="w-full md:w-full px-3 mb-4">
              <label htmlFor="name" className={style.inputLabel} >{ isCategory ? "Nombre de la categoría" : "Nombre de la sub Categoría" } </label>
              <input {...register("name", {})} className={`${style.input} w-full`} />
            </div>

              <div className="flex justify-center">
                { isSending ? <Button disabled={true} preset={Preset.saving} /> : <Button type="submit" preset={Preset.save} /> }
              </div>
      </form>
      {message.errors && (
                <div className="mt-4">
                  <Alert
                    type="red"
                    info="Error"
                    text={JSON.stringify(message.message)}
                    isDismisible={false}
                  />
                </div>
              )}
      <ToastContainer />
    </>
    }
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
