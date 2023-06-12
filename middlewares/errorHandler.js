import OwnError from "../services/Error";

const ErrorHandle = (err, req, res, next) => {
  console.log(err);
  if (err instanceof OwnError) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ error: { message: "Internal server error" } });
  }
};

export default ErrorHandle;
