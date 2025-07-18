import { Card, Row, Col, Input, Tooltip} from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const Filters = ({ filters, onFilterChange, onClearFilters, filterSchema }) => {
  const renderFilterInput = (field, config) => {
    switch (config.type) {
      case 'text':
        return (
          <Input
            placeholder={config.placeholder}
            value={filters[field]}
            onChange={(e) => onFilterChange(field, e.target.value)}
            prefix={<SearchOutlined />}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card style={{ marginBottom: 16 }} className='border border-gray-200 rounded-lg w-full'>
      <Row gutter={[16, 16]} align="middle">
        {Object.entries(filterSchema).map(([field, config]) => (
          <Col key={field} xs={12} sm={8} md={6} lg={4}>
            {renderFilterInput(field, config)}
          </Col>
        ))}
        <Col xs={2} sm={2} md={2} lg={2}>
          <Tooltip title="Borrar filtros">
            <ClearOutlined
              onClick={onClearFilters}
              style={{ fontSize: '20px', cursor: 'pointer', color: '#999' }}
            />
          </Tooltip>
        </Col>
      </Row>
    </Card>
  );
};

Filters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  filterSchema: PropTypes.object.isRequired,
};

export default Filters;