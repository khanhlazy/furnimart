import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dispute, DisputeDocument } from './schemas/dispute.schema';
import { CreateDisputeDto, UpdateDisputeDto } from './dtos/dispute.dto';

@Injectable()
export class DisputesService {
  constructor(
    @InjectModel(Dispute.name) private disputeModel: Model<DisputeDocument>,
  ) {}

  async create(customerId: string, customerName: string, createDisputeDto: CreateDisputeDto): Promise<DisputeDocument> {
    return this.disputeModel.create({
      ...createDisputeDto,
      customerId,
      customerName,
      status: 'pending',
    });
  }

  async findAll(filters?: { status?: string; customerId?: string }): Promise<DisputeDocument[]> {
    const query: any = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.customerId) query.customerId = filters.customerId;
    return this.disputeModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<DisputeDocument> {
    const dispute = await this.disputeModel.findById(id).exec();
    if (!dispute) {
      throw new NotFoundException('Tranh chấp không tồn tại');
    }
    return dispute;
  }

  async findByOrderId(orderId: string): Promise<DisputeDocument[]> {
    return this.disputeModel.find({ orderId }).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, updateDisputeDto: UpdateDisputeDto, reviewedBy: string): Promise<DisputeDocument> {
    const dispute = await this.findById(id);
    
    Object.assign(dispute, updateDisputeDto);
    dispute.reviewedBy = reviewedBy as any;
    
    if (updateDisputeDto.status === 'resolved') {
      dispute.resolvedAt = new Date();
    }

    return dispute.save();
  }

  async getStats(): Promise<{
    pending: number;
    reviewing: number;
    resolved: number;
    rejected: number;
    total: number;
  }> {
    const [pending, reviewing, resolved, rejected, total] = await Promise.all([
      this.disputeModel.countDocuments({ status: 'pending' }).exec(),
      this.disputeModel.countDocuments({ status: 'reviewing' }).exec(),
      this.disputeModel.countDocuments({ status: 'resolved' }).exec(),
      this.disputeModel.countDocuments({ status: 'rejected' }).exec(),
      this.disputeModel.countDocuments().exec(),
    ]);

    return { pending, reviewing, resolved, rejected, total };
  }
}

