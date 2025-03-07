import { useForm } from "react-hook-form";
import { Validation } from "./validate";
import { yupResolver } from "@hookform/resolvers/yup";
import HFTextField from "../../../../components/FormElements/HFTextField";
import usePageRouter from "../../../../hooks/useObjectRouter";
import CModal from "../../../../components/CElements/CModal";
import ImageUploadBtn from "../../../../components/Buttons/ImageUpload";
import carService from "../../../../services/cars";
import Classes from "./Classes";
import { useQuery } from "react-query";
import { websiteActions } from "../../../../store/website";
import { useDispatch } from "react-redux";
import { useMemo } from "react";
// import CTabs from "../../../../components/CElements/CTab";


interface Props {
  classes: any;
  tab?: any;
  getCarList: (val: any) => void;
  clas?: any
  id?: any;
}

const Form = ({id, classes = [], getCarList, tab }: Props) => {

  // console.log(classes);

  const schema = Validation();
  const dispatch = useDispatch();
  const { navigateQuery, getQueries } = usePageRouter();
  const query = getQueries();

  const { control, setValue, getValues, reset } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const { data: car } = useQuery(
    ["GET_CAR", query.id],
    () => {
      return carService.getElement(query.id);
    },
    {
      enabled: query.id !== "create" && query.id ? true : false,
    }
  );




  const HandleSuccess = (title: string) => {
    dispatch(
      websiteActions.setAlertData({
        title: title,
        translation: "common",
      })
    );

    navigateQuery({ id: "" });
    getCarList(tab);
    reset();
  };

  const SubmitForm = async () => {
   
    console.log(id);
    
    const data: any = getValues();
    const params: any = {};

    // console.log(data.file_id);

    const file_id = data.file_id.toString();

    // console.log(file_id);

    params.car_class_ids = data.ids;
    params.name = data.name_uz;
    params.file_id = +file_id;


    // params.name = {
    //   // uz: data.name_uz || "",
    //   // ru: data.name_ru || "",
    //   en: data.name_en || "",
    // };



    const updatedParams: any = {};

    // console.log(updatedParams.name);


    if (query.id !== "create" && car?.data) {
      if (params.car_class_ids && params.car_class_ids !== car.data.class_ids) {
        updatedParams.car_class_ids = params.car_class_ids;
      }
      if (params.name && params.name !== car.data.name.uz) {
        updatedParams.name = params.name;
      }
      if (params.file_id && params.file_id !== car.data.file_id) {
        updatedParams.file_id = params.file_id;
      }
    }


    if (query.id === "create") {
      carService.createElement(updatedParams).then(() => {
        HandleSuccess("Ma'lumot yaratildi!");
        
      });
    } else {
      carService.updateElement(query.id, updatedParams).then((res) => {
        if (res?.data) {
          HandleSuccess("Ma'lumot yangilandi!");
        }
      });
    }
  };

  const classList = useMemo(() => {
    return classes?.map((i: any) => {
      return {
        ...i,
        checked: car?.data?.class_ids?.includes(+i.slug) || false,
      };
    });
  }, [car, classes]);


  const clas = car?.data?.class_names.join('');

  // console.log(clas);


  return (
    <CModal
      title={query.id === "create" ? "add_new_mark" : "Tahrirlash"}
      open={!!query?.id}
      handleClose={() => {
        navigateQuery({ id: "" });
        reset();
      }}
      handleSave={() => SubmitForm()}
      textDeleteBtn="cancel"
    >
      {/* <CTabs
        slug="lang"
        tabList={tabList ?? []}
        customStyles={{
          "&": {
            width: "100%",
          },
          "& .MuiButtonBase-root": {
            width: "33%",
          },
        }}
      /> */}

      <div className="grid space-y-3">
        <HFTextField
          name={`name_${query?.lang || "uz"}`}
          control={control}
          placeholder={`Marka nomi`}
          // label="Marka nomi"
          // label={undefined}
          setValue={setValue}
          required={true}
          defaultValue={car?.data?.name?.[query?.lang || "uz"]}
        />

        <ImageUploadBtn
          text="Mashina rasmi"
          name="file_id"
          setValue={setValue}
          defaultValue={car?.data?.image}
        />
        <Classes
          classes={classList}
          defaultValue={car?.data?.class_ids}
          setValue={setValue}
          clas={clas}
        />
      </div>
    </CModal>
  );
};

export default Form;
