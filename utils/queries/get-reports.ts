import { useQuery } from '@tanstack/react-query';
import api from '../api';

interface ReportStatusResponse {
  status_code: number;
  success: boolean;
  message: string;
  data: {
    status: string;
  };
}

const fetchReportStatus = async (reportId: string) => {
  const { data } = await api.get<ReportStatusResponse>(
    `/citizens/report/status/${reportId}`
  );
  return data;
};

export const useReportStatus = (reportId: string | undefined) => {
  return useQuery({
    queryKey: ['reportStatus', reportId],
    queryFn: () => fetchReportStatus(reportId!),
    enabled: !!reportId,
  });
};