import { fail, ok } from "../utils/response.js";
import { getLogs, getLogsStats } from "../services/logs.service.js";

export async function fetchLogs(req, res) {
  try {
    const { type, page, limit } = req.query;
    const result = await getLogs({ type, page, limit });
    return ok(res, result);
  } catch (error) {
    return fail(res, error.message || "Failed to fetch logs", 500);
  }
}

export async function fetchLogsStats(req, res) {
  try {
    const stats = await getLogsStats();
    return ok(res, { stats });
  } catch (error) {
    return fail(res, error.message || "Failed to fetch log stats", 500);
  }
}
