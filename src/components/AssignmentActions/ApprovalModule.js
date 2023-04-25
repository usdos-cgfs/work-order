export default function ApprovalActions(params) {
  console.log("hello from approval module", params);

  const approve = async () => {
    console.log("approved");
  };

  const reject = async () => {
    console.log("reject");
  };
  return { approve, reject };
}

ApprovalActions.prototype.dispose = function () {
  console.log("disposing approval");
};
