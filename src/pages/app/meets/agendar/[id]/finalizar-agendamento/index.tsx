import {
  Flex,
  Heading,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Select,
  Button,
  Box
} from "@chakra-ui/react";
import Router from "next/router";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthContext } from "../../../../../../contexts/AuthContext";
import { setupAPIClient } from "../../../../../../services/api";
import { api } from "../../../../../../services/apiClient";
import { withSSRAuth } from "../../../../../../utils/withSSRAuth";
import { Input } from '../../../../../../components/Forms/Input'
import { formatCurrency } from '../../../../../../utils/formatCurrency'

type User = {
  id: string;
}

type CheckoutFormData = {
  endDate: string;
  user: User;
  cardNumber: string;
  cardCvv: string;
  cardExpirationDate: string;
  cardHolderName: string;
  userName: string;
  userType?: string;
  country: string;
  userEmail: string;
  documentType: string;
  documentNumber: string;
  birthday?: string;
  billingName?: string;
  stateShortname: string;
  city: string;
  neighborhood: string;
  street: string;
  streetNumber: string;
  zipcode: string;
  meetId: string;
  meetName: string;
  unitPrice: number;
  meetQuantity: number;
  phoneNumbers: string;
}


export default function FinalizarAgendamento({ meet }) {
  const { user } = useContext(AuthContext)
  const { register, formState: { isSubmitting }, handleSubmit } = useForm()

  const handleCheckout: SubmitHandler<CheckoutFormData> = async (
    values,
    event
  ) => {
    event.preventDefault();

    const meetPrice = Number(meet.price + "00")

    const data = {
      userRole: "user",
      endDate: "2022-01-03T15:30:00", //TODO - TEMPORARY
      amount: meetPrice,
      cardNumber: values.cardNumber,
      cardCvv: values.cardCvv,
      cardExpirationDate: values.cardExpirationDate,
      cardHolderName: values.cardHolderName,
      // person
      userId: user.id,
      userName: values.userName,
      type: "individual",
      country: "br",  //TODO Country Switcher values.country
      userEmail: values.userEmail,
      // document
      documentType: "cpf",
      documentNumber: values.documentNumber,
      phoneNumbers: "+55" + values.phoneNumbers,
      // Adress
      billingName: values.userName,
      stateShortname: values.stateShortname,
      city: values.city,
      neighborhood: values.neighborhood,
      street: values.street,
      streetNumber: values.streetNumber,
      zipcode: values.zipcode,
      //products
      meetId: Router.query.id,
      meetName: meet.name,
      unitPrice: meetPrice,
      meetQuantity: 1,
    }

    await api.post(`meets/pay/${meet.id}`, data)
      .then((response) => {
        if (response.status === 200) {
          Router.push('/app/meets/agendados')
        }

        return console.log(response.data)
      })

  }

  return (
    <>
      <Box
        w='100%'
        bg='blue.500'
        h='50vh'
      ></Box>
      <Box
        as="form"
        onSubmit={handleSubmit(handleCheckout)}
        mx='auto'
        w='50%'
        zIndex='1000'
        mt='-20%'
        mb='16'
      >
        <Flex
          bg='white'
          borderRadius='lg'
          boxShadow='lg'
          p='8'
          mb='6'
          justify='flex-end'
          direction='column'
        >
          <Heading
            size='md'
          >
            {meet.name}
          </Heading>
          <Flex
            justify='flex-end'
          >
            {formatCurrency(Number(meet.price))}
          </Flex>
        </Flex>
        <Flex
          p='8'
          direction="column"
          bg='white'
          borderRadius='lg'
          boxShadow='lg'
        >
          <Heading
            as="span"
            size="md"
            fontWeight='thin'
            textAlign="left"
            color="gray.400"
            py={4}
          >
            Dados do comprador
          </Heading>
          <Grid
            w="100%"
            templateColumns="repeat(2, 1fr)"
            gap={4}
          >
            <GridItem
              columnSpan={1}
            >
              <Input
                name="userName"
                id="userName"
                type="text"
                label="Nome completo"
                mb={4}
                {...register('userName')}
              />
              <Input
                name="street"
                id="street"
                type="text"
                label="Endereço"
                mb={4}
                {...register('street')}
              />

              <Input
                name="streetNumber"
                id="streetNumber"
                type="text"
                label="Número"
                mb={4}
                {...register('streetNumber')}
              />

              <Input
                name="city"
                id="city"
                type="text"
                label="Cidade"
                mb={4}
                {...register('city')}
              />

              <FormControl>
                <FormLabel for="stateShortname" color="gray.500">Estado</FormLabel>
                <Select
                  name="stateShortname"
                  id="stateShortname"
                  type="text"
                  mb={4}
                  h={12}
                  width="80px"
                  {...register('stateShortname')}
                >
                  <option value="ac">AC</option>
                  <option value="al">AL</option>
                  <option value="ap">AP</option>
                  <option value="am">AM</option>
                  <option value="ba">BA</option>
                  <option value="ce">CE</option>
                  <option value="es">ES</option>
                  <option value="go">GO</option>
                  <option value="ma">MA</option>
                  <option value="mt">MT</option>
                  <option value="ms">MS</option>
                  <option value="mg">MG</option>
                  <option value="pa">PA</option>
                  <option value="pb">PB</option>
                  <option value="pr">PR</option>
                  <option value="pe">PE</option>
                  <option value="pi">PI</option>
                  <option value="rj">RJ</option>
                  <option value="rn">RN</option>
                  <option value="rs">RS</option>
                  <option value="ro">RO</option>
                  <option value="rr">RR</option>
                  <option value="rs">SC</option>
                  <option value="sp">SP</option>
                  <option value="se">SE</option>
                  <option value="to">TO</option>
                  <option value="df">DF</option>
                </Select>
              </FormControl>
              <Input
                name="userEmail"
                id="userEmail"
                type="text"
                label="Email"
                mb={4}
                {...register('userEmail')}
              />
            </GridItem>
            <GridItem
              columnSpan={1}
            >
              <Input
                name="documentNumber"
                id="documentNumber"
                type="text"
                label="CPF"
                mb={4}
                {...register('documentNumber')}
              />
              <Input
                name="country"
                id="country"
                type="text"
                label="País"
                mb={4}
                {...register('country')}
              />
              <Input
                name="zipcode"
                id="zipcode"
                type="text"
                label="CEP"
                mb={4}
                {...register('zipcode')}
              />
              <Input
                name="neighborhood"
                id="neighborhood"
                type="text"
                label="Bairro"
                mb={4}
                {...register('neighborhood')}
              />
              <Input
                name="phoneNumbers"
                id="phoneNumbers"
                type="text"
                label="Telefone"
                mb={4}
                {...register('phoneNumbers')}
              />
            </GridItem>
          </Grid>
          <Heading
            as="span"
            size="md"
            fontWeight='thin'
            textAlign="left"
            color="gray.400"
            py={4}
          >
            Dados de pagamento
          </Heading>
          <Flex
            w='50%'
          >
            <Box>
              <Input
                name="cardHolderName"
                id="cardHolderName"
                type="text"
                label="Nome (como escrito no cartão)"
                mb={4}
                {...register('cardHolderName')}
              />
              <Input
                name="cardNumber"
                id="cardNumber"
                type="text"
                label="Número do cartão"
                mb={4}
                {...register('cardNumber')}
              />
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Input
                  name="cardExpirationDate"
                  id="cardExpirationDate"
                  type="text"
                  label="Validade"
                  {...register('cardExpirationDate')}
                />
                <Input
                  name="cardCvv"
                  id="cardCvv"
                  type="text"
                  label="CVV"
                  {...register('cardCvv')}
                />
              </Grid>
            </Box>
          </Flex>
          <Button
            type="submit"
            size="lg"
            mt='12'
            colorScheme="blue"
            isLoading={isSubmitting}
          >
            Finalizar compra
          </Button>
        </Flex>
      </Box>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get(`meets/${ctx.query.id}`)

  return {
    props: {
      meet: response.data
    }
  }
})