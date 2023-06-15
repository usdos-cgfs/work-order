import { RequestEntity } from "../../entities/Request.js";
import { getAppContext } from "../../infrastructure/ApplicationDbContext.js";

export default class MigrationView {
  constructor() {
    this._context = getAppContext();
  }

  migrateRequests = async () => {
    const legacyRequests = await this._context.Requests.FindByColumnValue(
      [{ column: "RequestStatus", op: "neq", value: null }],
      {},
      {},
      RequestEntity.Views.ByStatus,
      false
    );
  };
}
