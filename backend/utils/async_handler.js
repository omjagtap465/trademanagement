// // const asyncHandler = (controller) => {
// //   function requestHandler(req, res, next) {
// //     Promise.resolve(controller(req, res, next)).catch((err) => next(err));
// //   }
// //   return requestHandler;
// // };

// // export { asyncHandler };
// const asyncHandler = (controller) => {
//   function requestHandler(req, res, next) {
//     try {
//       controller(req, res, next).then((result) => {
//         res.json(result);
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   return requestHandler;
// };
function asyncHandler(fn) {
  return async function as(req, res, next) {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
export { asyncHandler };
