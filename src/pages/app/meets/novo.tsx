import { Box, Flex, Heading, VStack, SimpleGrid, FormLabel, Button, HStack, Textarea, FormControl, Select, Text, Spinner } from '@chakra-ui/react';
import Link from "next/link";
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
const { yupResolver } = require('@hookform/resolvers/yup')
import Router from 'next/router';
import { useContext } from 'react'

import { Input } from '../../../components/Forms/Input';
import { api } from '../../../services/apiClient';
import AppContainer from '../../../components/AppContainer';
import { AuthContext } from '../../../contexts/AuthContext';
import { withSSRAuth } from '../../../utils/withSSRAuth';
import { setupAPIClient } from '../../../services/api';
import { useCategories } from '../../../services/hooks/categories/useCategories';

type CreateMeetFormData = {
  name: string;
  price: string;
  mentorEmail: string;
  meetDetails?: string;
  categoryId: string;
}

const createMeetFormSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  meetDetails: yup.string(),
  price: yup.number().required('Preço é obrigatório'),
})

export default function MentorMeetCriation() {
  const { data, isLoading, error } = useCategories()

  const { user } = useContext(AuthContext)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createMeetFormSchema)
  })

  const handleCreateMentor: SubmitHandler<CreateMeetFormData> = async (values) => {

    const response = await api.post('/meets', {
      name: values.name,
      meetDetails: values.meetDetails,
      price: values.price,
      categoryId: values.categoryId,
      email: user.id,
    })

    if (response.status === 201) {
      Router.push('/app/meets')
    }

  }

  return (
    <AppContainer>
      <Flex w="100%" maxWidth={1480} mx="auto">
        <Box
          as="form"
          flex="1"
          borderRadius="8"
          bg="white"
          onSubmit={handleSubmit(handleCreateMentor)}
        >
          <Heading size="lg" fontWeight="normal" mb="4">Criar meet</Heading>
          <VStack spacing="4">
            <SimpleGrid spacing={["6", "8"]} w="100%">
              <Input
                id="name"
                name="name"
                type="text"
                label="Título do meet"
                {...register('name')}
                error={errors.name}
              />
            </SimpleGrid>
            <SimpleGrid spacing={["6", "8"]} w="100%" templateColumns="repeat(2, 1fr)">
              <Input
                id="price"
                name="price"
                type="number"
                label="Preço"
                {...register('price')}
                error={errors.price}
              />
              <Box>
                {isLoading ? (

                  <Flex justify="center" mt={12}>
                    <Spinner />
                  </Flex>

                ) : error ? (
                  <Flex justify="center">
                    <Text>Erro ao carregar as categorias</Text>
                  </Flex>

                ) : (

                  <FormControl>
                    <FormLabel>Categoria do Meet</FormLabel>
                    <Select
                      name="categoryId"
                      id="categoryId"
                      border="1px"
                      borderColor="gray.300"
                      height={12}
                      {...register('categoryId')}
                    >
                      {
                        data.map(category => {
                          return (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          )
                        })
                      }
                    </Select>
                  </FormControl>

                )}

              </Box>
            </SimpleGrid>
            <VStack w="100%" justify="flex-start">
              <FormControl>
                <FormLabel htmlFor="meetDetails" w="100%" ml="3">Detalhes do meet</FormLabel>
                <Textarea
                  focusBorderColor="blue.500"
                  h={40}
                  id="meetDetails"
                  name="meetDetails"
                  type="text"
                  obs="(Importante se for Mentor)"
                  {...register('meetDetails')}
                  error={errors.meetDetails}
                />
              </FormControl>
            </VStack>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/usuarios" passHref>
                <Button
                  colorScheme="blackAlpha"
                  _hover={{
                    bg: "red.500",
                  }}
                >
                  Cancelar
                </Button>
              </Link>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isSubmitting}
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex >
    </AppContainer>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const reponse = await apiClient.get('/me')

  return {
    props: {}
  }
})
