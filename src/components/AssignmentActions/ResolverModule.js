export default function (params) {
  console.log("hello from resolver module", params);

  const complete = async () => {
    console.log("complete");
  };

  return {
    complete,
  };
}
