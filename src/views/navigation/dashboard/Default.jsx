// react-bootstrap
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import MainCard from 'components/MainCard';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Stack from 'react-bootstrap/Stack';
// project-imports
import SalesPerformanceCard from 'components/cards/SalesPerformanceCard';
import SocialStatsCard from 'components/cards/SocialStatsCard';
import StatIndicatorCard from 'components/cards/StatIndicatorCard';
import { UsersMap, EarningChart, RatingCard, RecentUsersCard } from 'sections/dashboard/default';
import { getDashboardData } from '../../../utils/ApiService';
// ===============================|| SALES PERFORMANCE CARD - DATA ||============================== //

const salesPerformanceData = [
  { title: 'Daily Hiring', icon: 'ph ph-arrow-up text-success', amount: '2', progress: { now: 67, className: 'bg-brand-color-1' } },
  {
    title: 'Monthly Hiring',
    icon: 'ph ph-arrow-down text-danger',
    amount: '16',
    progress: { now: 36, className: 'bg-brand-color-2' }
  },
  { title: 'Yearly Hiring', icon: 'ph ph-arrow-up text-success', amount: '102', progress: { now: 80, className: 'bg-brand-color-1' } }
];

// ===============================|| STAT INDICATOR CARD - DATA ||============================== //

const statIndicatorData = [
  { icon: 'ph ph-lightbulb-filament', value: '235', label: 'TOTAL Hired', iconColor: 'text-success' },
  // { icon: 'ph ph-map-pin-line', value: '26', label: 'TOTAL LOCATION', iconColor: 'text-primary' }
];

// ===============================|| SOCIAL STATS CARD - DATA ||============================== //

const socialStatsData = [
  {
    icon: 'ti ti-brand-facebook-filled text-primary',
    count: '12,281',
    percentage: '+7.2%',
    color: 'text-success',
    stats: [
      {
        label: 'Target',
        value: '35,098',
        progress: {
          now: 60,
          className: 'bg-brand-color-1'
        }
      },
      {
        label: 'Duration',
        value: '3,539',
        progress: {
          now: 45,
          className: 'bg-brand-color-2'
        }
      }
    ]
  },
  {
    icon: 'ti ti-brand-twitter-filled text-info',
    count: '11,200',
    percentage: '+6.2%',
    color: 'text-primary',
    stats: [
      {
        label: 'Target',
        value: '34,185',
        progress: {
          now: 40,
          className: 'bg-success'
        }
      },
      {
        label: 'Duration',
        value: '4,567',
        progress: {
          now: 70
        }
      }
    ]
  },
  {
    icon: 'ti ti-brand-google-filled text-danger',
    count: '10,500',
    percentage: '+5.9%',
    color: 'text-primary',
    stats: [
      {
        label: 'Target',
        value: '25,998',
        progress: {
          now: 80,
          className: 'bg-brand-color-1'
        }
      },
      {
        label: 'Duration',
        value: '7,753',
        progress: {
          now: 50,
          className: 'bg-brand-color-2'
        }
      }
    ]
  }
];
const cardConfigs = [
  {
    title: "Pending Applications",
    dataKey: "pending",
    icon: "fa fa-clock-o",
    color: "#f39c12" // Orange for pending
  },
  {
    title: "Shortlisted Candidates",
    dataKey: "shortlisted",
    icon: "fa fa-star",
    color: "#3498db" // Blue for shortlisted
  },
  {
    title: "Rejected Applications",
    dataKey: "rejected",
    icon: "fa fa-times-circle",
    color: "#e74c3c" // Red for rejected
  },
  {
    title: "Hired Employees",
    dataKey: "hired",
    icon: "fa fa-check-circle",
    color: "#27ae60" // Green for hired
  }
];


// ================================|| DASHBOARD - DEFAULT ||============================== //

export default function DefaultPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
        console.log(data, "data_res");
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  if (loading) {
    return (
      <Row>
        {[1, 2, 3, 4].map((item) => (
          <Col md={12} xl={3} key={item}>
            <MainCard>
              <Stack className="gap-4">
                <h6 className="mb-0">Loading...</h6>
                <Stack direction="horizontal" className="justify-content-between align-items-center">
                  <Stack direction="horizontal" className="mb-0">
                    <i className="fa fa-spinner fa-spin f-30 m-r-10" />
                    <h3 className="f-w-300 mb-0">-</h3>
                  </Stack>
                </Stack>
              </Stack>
            </MainCard>
          </Col>
        ))}
      </Row>
    );
  }
  if (!dashboardData || dashboardData.resultCode !== "COMM_OPERATION_SUCCESS") {
    return (
      <Row>
        <Col md={12}>
          <MainCard>
            <div className="text-center p-4">
              <i className="fa fa-exclamation-triangle f-30 text-warning mb-3" />
              <h5>Unable to load dashboard data</h5>
              <p className="text-muted">Please try refreshing the page</p>
            </div>
          </MainCard>
        </Col>
      </Row>
    );
  }
  return (
    <Row>
      {/* row - 1 */}
      {/* {salesPerformanceData.map((item, index) => (
        <Col key={index} md={index === 2 ? 12 : 6} xl={4}>
          <SalesPerformanceCard {...item} />
        </Col>
      ))} */}
      <Row>
        {cardConfigs.map((config, index) => {
          const value = dashboardData.payLoad[config.dataKey] || 0;

          return (
            <Col md={12} xl={3} key={config.dataKey}>
              <MainCard>
                <Stack className="gap-4">
                  <h6 className="mb-0">{config.title}</h6>
                  <Stack direction="horizontal" className="justify-content-between align-items-center">
                    <Stack direction="horizontal" className="mb-0">
                      <i
                        className={`${config.icon} f-30 m-r-10`}
                        style={{ color: config.color }}
                      />
                      <h3 className="f-w-300 mb-0">{value}</h3>
                    </Stack>
                  </Stack>
                </Stack>
              </MainCard>
            </Col>
          );
        })}
      </Row>

      {/* row - 2 */}
      {/* <Col md={6} xl={8}>
        <UsersMap />
      </Col>
      <Col md={6} xl={4}>
        <>
          <EarningChart />
          <StatIndicatorCard data={statIndicatorData} />
        </>
      </Col> */}

      {/* row - 3 */}
      {/* {socialStatsData.map((item, index) => (
        <Col key={index} md={index === 0 ? 12 : 6} xl={4}>
          <SocialStatsCard {...item} />
        </Col>
      ))} */}

      {/* row - 4 */}
      {/* <Col md={6} xl={4}>
        <RatingCard />
      </Col> */}
      <Col md={12} xl={12}>
        <RecentUsersCard />
      </Col>
    </Row>
  );
}
