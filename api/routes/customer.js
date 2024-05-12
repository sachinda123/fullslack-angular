const express = require("express");
const router = express.Router();
const { sendResponse, validateRequest } = require("../functions/common");
const { customerSchema } = require("../functions/schema");
const { Customer } = require("../models");
const { Op } = require("sequelize");

const { create, getAll, update, deletebyId, checkExist } = require("../functions/modelFunctions");
router.get("/all/", validateRequest("get-all", "customer"), async (req, res) => {
  try {
    const list = await getAll(Customer);
    return sendResponse(res, 200, list, true);
  } catch (error) {
    return sendResponse(res, 500, { code: "SERVER_ERROR", reason: `${error.message || "Server error"}` }, true);
  }
});
router.post("/create/", validateRequest("post-create", "customer"), async (req, res) => {
  try {
    const { error } = customerSchema.validate(req.body);
    if (error) {
      return sendResponse(res, 400, error.details[0].message, true);
    } else {
      const data = req.body;
      const exist = await checkExist({ where: { [Op.and]: [{ firstName: data.firstName }, { lastName: data.lastName }] } }, Customer);
      if (!exist) {
        data.active = 1;
        data.addedBy = req.user.id;
        const created = await create(data, Customer);
        return sendResponse(res, 200, created, true);
      } else {
        return sendResponse(res, 400, `Name exist on ID:-${exist.id}`, true);
      }
    }
  } catch (error) {
    return sendResponse(res, 500, { code: "SERVER_ERROR", reason: `${error.message || "Server error"}` }, true);
  }
});
router.put("/innactive/:id", validateRequest("put-innactive-id", "customer"), async (req, res) => {
  try {
    const id = req.params.id;
    const updatedRecord = await update(id, { active: 0 }, Customer);
    return sendResponse(res, 200, updatedRecord, true);
  } catch (error) {
    return sendResponse(res, 500, { code: "SERVER_ERROR", reason: `${error.message || "Server error"}` }, true);
  }
});
router.delete("/delete/:id", validateRequest("delete-delete-id", "customer"), async (req, res) => {
  try {
    const id = req.params.id;
    await deletebyId(id, Customer);
    return sendResponse(res, 200, { status: "delete sucess" }, true);
  } catch (error) {
    return sendResponse(res, 500, { code: "SERVER_ERROR", reason: `${error.message || "Server error"}` }, true);
  }
});
router.put("/update/:id", validateRequest("put-update-id", "customer"), async (req, res) => {
  try {
    const id = req.params.id;
    const { error } = customerSchema.validate(req.body);
    const data = req.body;
    if (error) {
      return sendResponse(res, 400, error.details[0].message, true);
    } else {
      // check customer new name exist in older records
      const exist = await checkExist(
        {
          where: {
            [Op.and]: [
              { firstName: data.firstName },
              { lastName: data.lastName },
              {
                id: {
                  [Op.ne]: id,
                },
              },
            ],
          },
        },
        Customer
      );
      if (!exist) {
        const updatedRecord = await update(id, req.body, Customer);
        return sendResponse(res, 200, updatedRecord, true);
      } else {
        return sendResponse(res, 400, `Name exist on ID:-${exist.id}`, true);
      }
    }
  } catch (error) {
    return sendResponse(res, 500, { code: "SERVER_ERROR", reason: `${error.message || "Server error"}` }, true);
  }
});
module.exports = router;
