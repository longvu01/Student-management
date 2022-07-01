import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import { InputField, RadioGroupField, SelectField } from 'components/FormFields';
import { selectCityOptions } from 'features/city/citySlice';
import { Student } from 'models';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export interface StudentFromProps {
  initialValues?: Student;
  onSubmit?: (formValues: Student) => void;
}

export default function StudentFrom({ initialValues, onSubmit }: StudentFromProps) {
  const [error, setError] = useState('');

  const cityOptions = useAppSelector(selectCityOptions);

  const schema = yup
    .object({
      name: yup
        .string()
        .required("Please enter student's name.")
        .test("Student's name need 2 words", 'Please enter at least two words', (value) => {
          if (!value?.trim()) return false;

          return value.split(' ').filter((x) => !!x).length >= 2;
        }),
      age: yup
        .number()
        .min(18, "Min student's age is 18")
        .max(60, "Max student's age is 60")
        .integer('Please enter an integer.')
        .required("Please enter student's age.")
        .typeError("Student's age must be a number"),
      mark: yup
        .number()
        .min(0, 'Min mark is 0')
        .max(10, 'Max mark is 10')
        .required("Please enter student's mark.")
        .typeError("Student's mark must be a number"),
      gender: yup
        .string()
        .oneOf(['male', 'female'], 'Please select either male or female')
        .required('Please select student gender.'),
      city: yup.string().required("Please select student's location."),
    })
    .required();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<Student>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  const handleStudentFormSubmit = async (formValues: Student) => {
    try {
      // Clear previous submission error
      setError('');
      await onSubmit?.(formValues);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Box maxWidth={400}>
      <form onSubmit={handleSubmit(handleStudentFormSubmit)}>
        <InputField name="name" control={control} label="Full Name" />

        <RadioGroupField
          name="gender"
          control={control}
          label="Gender"
          options={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ]}
        />

        <InputField name="age" control={control} label="Age" type="number" />
        <InputField name="mark" control={control} label="Mark" type="number" />

        {Array.isArray(cityOptions) && cityOptions.length > 0 && (
          <SelectField name="city" control={control} label="City" options={cityOptions} />
        )}

        {error && <Alert severity="error">{error}</Alert>}

        <Box mt={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            sx={{ minWidth: '50%', position: 'relative' }}
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <CircularProgress sx={{ position: 'absolute', left: '20%' }} size={16} />
            )}
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
}
