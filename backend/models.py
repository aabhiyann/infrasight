from sqlalchemy import Column, String, Integer, Date, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Table structure definitions
class CostLog(Base):
    __tablename__ = "cost_logs"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    service = Column(String, nullable=False)
    amount = Column(Float, nullable=False)

