const express = require("express");
const router = express.Router();
const { sendResponse, validateRequest } = require("../functions/common");
const { medicationSchema } = require("../functions/schema");
const { Medication } = require("../models");
const { Op } = require("sequelize");

const { create, getAll, update, deletebyId, checkExist } = require("../functions/modelFunctions");

router.get("/all/", validateRequest("get-all", "medication"), async (req, res) => {
  try {
    const list = await getAll(Medication);
    return sendResponse(res, 200, list, true);
  } catch (error) {
    return sendResponse(res, 500, { code: "SERVER_ERROR", reason: `${error.message || "Server error"}` }, true);
  }
});
router.post("/create/", validateRequest("post-create", "medication"), async (req, res) => {
  try {
    const { error } = medicationSchema.validate(req.body);
    if (error) {
      return sendResponse(res, 400, error.details[0].message, true);
    } else {
      const data = req.body;
      const exist = await checkExist({ where: { name: data.name } }, Medication);
      if (!exist) {
        data.active = 1;
        data.addedBy = req.user.id;
        const created = await create(data, Medication);
        return sendResponse(res, 200, created, true);
      } else {
        return sendResponse(res, 400, `Name exist on Id:-${exist.id}`, true);
      }
    }
  } catch (error) {
    return sendResponse(res, 500, { code: "SERVER_ERROR", reason: `${error.message || "Server error"}` }, true);
  }
});
router.put("/innactive/:id", validateRequest("put-innactive-id", "medication"), async (req, res) => {
  try {
    const id = req.params.id;
    const updatedRecord = await update(id, { active: 0 }, Medication);
    return sendResponse(res, 200, updatedRecord, true);
  } catch (error) {
    return sendResponse(res, 500, { code: "SERVER_ERROR", reason: `${error.message || "Server error"}` }, true);
  }
});
router.put("/update/:id", validateRequest("put-update-id", "medication"), async (req, res) => {
  try {
    const id = req.params.id;
    const { error } = medicationSchema.validate(req.body);
    const data = req.body;
    if (error) {
      return sendResponse(res, 400, error.details[0].message, true);
    } else {
      // check update name exist on anothre records
      const exist = await checkExist(
        {
          where: {
            [Op.and]: [
              { name: data.name },
              {
                id: {
                  [Op.ne]: id,
                },
              },
            ],
          },
        },
        Medication
      );

      if (!exist) {
        const updatedRecord = await update(id, data, Medication);
        return sendResponse(res, 200, updatedRecord, true);
      } else {
        return sendResponse(res, 400, `Name exist on Id:-${exist.id}`, true);
      }
    }
  } catch (error) {
    return sendResponse(res, 500, { code: "SERVER_ERROR", reason: `${error.message || "Server error"}` }, true);
  }
});
router.delete("/delete/:id", validateRequest("delete-delete-id", "medication"), async (req, res) => {
  try {
    const id = req.params.id;
    await deletebyId(id, Medication);
    return sendResponse(res, 200, { status: "delete sucess" }, true);
  } catch (error) {
    return sendResponse(res, 500, { code: "SERVER_ERROR", reason: `${error.message || "Server error"}` }, true);
  }
});

module.exports = router;
