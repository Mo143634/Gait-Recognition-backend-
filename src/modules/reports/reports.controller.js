import * as reportsService from "./reports.service.js";

/**
 * GET /api/reports/summary
 */
export const getSummary = async (req, res, next) => {
    try {
        const data = await reportsService.getSummary();
        return res.status(200).json({
            success: true,
            data,
            error: null
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * GET /api/reports/accuracy-by-condition
 */
export const getAccuracyByCondition = async (req, res, next) => {
    try {
        const data = await reportsService.getAccuracyByCondition();
        return res.status(200).json({
            success: true,
            data,
            error: null
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * GET /api/reports/dataset-distribution
 */
export const getDatasetDistribution = async (req, res, next) => {
    try {
        const data = await reportsService.getDatasetDistribution();
        return res.status(200).json({
            success: true,
            data,
            error: null
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * GET /api/reports/export
 */
export const exportReports = async (req, res, next) => {
    try {
        const data = await reportsService.exportReports();
        return res.status(200).json({
            success: true,
            data,
            error: null
        });
    } catch (error) {
        return next(error);
    }
};
