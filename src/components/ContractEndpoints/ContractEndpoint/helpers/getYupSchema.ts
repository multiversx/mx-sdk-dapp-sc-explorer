// Apply general checks on submit, maybe validate per field on input based on type in a later version?
// const validationSchema = lazy((obj) => {
//   if (obj !== undefined) {
//     const shapes = {};
//     try {
//       const validationKeys = Object.keys(obj);
//       validationKeys.forEach((parameter) => {
//         const foundInput = input.find((definition, index) => {
//           return getUniqueDefinitionName({ definition, index }) === parameter;
//         });
//         if (foundInput) {
//           const checkType = foundInput?.type?.isGenericType()
//             ? foundInput?.type?.getFirstTypeParameter()
//             : foundInput?.type;
//           if (
//             checkType &&
//             !checkType?.hasExactClass(OptionalType.ClassName)
//           ) {
//             shapes[parameter] = string().required('Required');
//           }
//         }
//       });
//     } catch {}

//     return object()
//       .shape(shapes)
//       .test('validArguments', (value, { createError }) => {
//         try {
//           const existingValues = Object.values(value);
//           NativeSerializer.nativeToTypedValues(
//             existingValues || [],
//             endpoint
//           );
//         } catch (error) {
//           return createError({
//             path: 'general',
//             message: String(error)
//           });
//         }

//         return true;
//       });
//   }

//   return mixed().notRequired();
// });
