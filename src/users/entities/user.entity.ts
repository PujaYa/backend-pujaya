import { Auction } from 'src/auctions/entities/auction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../types/roles';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
    unique: true,
  })
  firebaseUid: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  imgProfile: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  country: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  address: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.REGULAR,
  })
  role: UserRole;

  @Column({
    type: 'json',
    nullable: true,
  })
  permissions: {
    canManageUsers?: boolean;
    canEditAuctions?: boolean;
    canDeleteListings?: boolean;
    suscriptionType?: 'monthly' | 'annual';
  };

  @OneToMany(() => Auction, (auction) => auction.owner)
  auctions: Auction[];

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deactivatedAt: Date | null;


}
