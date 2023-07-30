import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useToast } from '@/hooks/use-toast';
import useUser from '@/hooks/useUser';
import { useMutation } from '@tanstack/react-query';

import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface UserFormProps {
  type?: "student" | "employee";
}

const UserForm: FC<UserFormProps> = ({ type = "student" }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { dispatch: userDispatch } = useUser();
  const [newUser, setNewUser] = useState<any>({});

  const { mutate: verifyUser } = useMutation({
    mutationFn: async (data: any) => {
      setIsLoading(true);
      setNewUser(data);
      const payload = {
        type,
        ...data,
      };
      const { data: resp } = await axios.post("/api/verifyUser", payload);

      return resp;
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Something went wrong",
        variant: "destructive",
      });
    },
    onSuccess: (data: any) => {
      switch (data.code) {
        case "USER_EXISTS":
          setIsLoading(false);
          userDispatch({
            type: "SET_USER",
            payload: {
              type,
              ...newUser,
              id: data.user?.id,
            },
          });
          return;
        case "RESPONSE_EXISTS":
          setIsLoading(false);
          return toast({
            title: "Response already exists",
            description: "Response already exists",
            variant: "destructive",
          });
        default:
          setIsLoading(false);
          return;
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  const onSubmit = async (data: any) => {
    if (type === "student") verifyUser(data);
    else {
      setIsLoading(false);
      userDispatch({
        type: "SET_USER",
        payload: {
          type,
          ...data,
        },
      });
    }
  };

  return type === "student" ? (
    <div className="flex items-center w-[100%] lg:justify-center">
      <form
        className="w-full p-4 m-4 border border-gray-200 rounded-lg"
        id="user-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* name */}
        <div className="flex flex-col mb-4 space-y-2">
          <label htmlFor="name">Name</label>
          <Input
            type="text"
            id="name"
            placeholder="Enter your name"
            {...register("name", {
              required: "Name is required",
            })}
          />
        </div>
        {/* Roll Number */}
        <div className="flex flex-col mb-4 space-y-2">
          <label htmlFor="rollNumber">Roll Number</label>
          <Input
            type="text"
            id="rollNumber"
            placeholder="Enter your Roll Number"
            {...register("rollNumber", {
              required: "Roll Number is required",
            })}
          />
        </div>
        <div className="flex flex-col mb-4 space-y-2">
          <label htmlFor="branch">Branch</label>
          <Input
            type="text"
            id="branch"
            placeholder="Enter your Branch"
            {...register("branch", {
              required: "Branch is required",
            })}
          />
        </div>
        <div className="flex flex-col mb-4 space-y-2">
          <label htmlFor="semester">Semester</label>
          <Input
            type="number"
            id="semester"
            min={1}
            placeholder="Enter your Semester"
            {...register("semester", {
              required: "Semester is required",
            })}
          />
        </div>
        <div className="flex flex-col mb-4 space-y-2">
          <Button type="submit" isLoading={isLoading}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  ) : (
    <div className="flex items-center w-[100%] lg:justify-center">
      <form
        className="w-full p-4 m-4 border border-gray-200 rounded-lg"
        id="user-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* name */}
        <div className="flex flex-col mb-4 space-y-2">
          <label htmlFor="name">Name</label>
          <Input
            type="text"
            id="name"
            placeholder="Enter your name"
            {...register("name")}
          />
        </div>
        {/* Age */}
        <div className="flex flex-col mb-4 space-y-2">
          <label htmlFor="age">Age</label>
          <Input
            type="number"
            id="age"
            placeholder="Enter your Age"
            min={18}
            {...register("age", {
              required: "Age is required",
            })}
          />
        </div>
        <div className="flex flex-col mb-4 space-y-2">
          <label htmlFor="workExperience">Work Experience</label>
          <Input
            type="number"
            id="workExperience"
            min={0}
            placeholder="Your Work Experience (years)"
            {...register("workExperience", {
              required: "Work Experience is required",
            })}
          />
        </div>
        <div className="flex flex-col mb-4 space-y-2">
          <label htmlFor="orgName">Name of organization</label>
          <Input
            type="text"
            id="orgName"
            placeholder="Enter your Organization Name"
            {...register("orgName", {
              required: "Organization Name is required",
            })}
          />
        </div>
        <div className="flex flex-col mb-4 space-y-2">
          <label htmlFor="gender">Your Gender</label>
          <select
            id="gender"
            className="w-full px-3 py-2 border border-gray-200 rounded-md"
            {...register("gender", {
              required: "Gender Name is required",
            })}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="flex flex-col mb-4 space-y-2">
          <Button type="submit" isLoading={isLoading} form="user-form">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
