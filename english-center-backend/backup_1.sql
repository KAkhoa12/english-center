--
-- PostgreSQL database dump
--

\restrict EijXwzO1agm1iVOFtuTkOOKhrKeZNpKUgHVhZAj80aRSgkIbrI7vJH1boXDnUip

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: assignment_attachment_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assignment_attachment_type AS ENUM (
    'file',
    'link'
);


ALTER TYPE public.assignment_attachment_type OWNER TO postgres;

--
-- Name: assignment_grading_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assignment_grading_method AS ENUM (
    'teacher',
    'ai',
    'mixed'
);


ALTER TYPE public.assignment_grading_method OWNER TO postgres;

--
-- Name: assignment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assignment_status AS ENUM (
    'draft',
    'published',
    'closed',
    'archived'
);


ALTER TYPE public.assignment_status OWNER TO postgres;

--
-- Name: assignment_submission_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assignment_submission_status AS ENUM (
    'draft',
    'submitted',
    'late',
    'graded',
    'returned',
    'cancelled'
);


ALTER TYPE public.assignment_submission_status OWNER TO postgres;

--
-- Name: assignment_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assignment_type AS ENUM (
    'homework',
    'writing',
    'speaking',
    'reading',
    'listening',
    'grammar',
    'vocabulary',
    'project',
    'other'
);


ALTER TYPE public.assignment_type OWNER TO postgres;

--
-- Name: attendance_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.attendance_status AS ENUM (
    'present',
    'absent',
    'late',
    'excused',
    'not_marked'
);


ALTER TYPE public.attendance_status OWNER TO postgres;

--
-- Name: cart_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.cart_status AS ENUM (
    'active',
    'checked_out',
    'abandoned'
);


ALTER TYPE public.cart_status OWNER TO postgres;

--
-- Name: class_enrollment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.class_enrollment_status AS ENUM (
    'enrolled',
    'completed',
    'dropped',
    'cancelled'
);


ALTER TYPE public.class_enrollment_status OWNER TO postgres;

--
-- Name: class_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.class_status AS ENUM (
    'planned',
    'ongoing',
    'completed',
    'cancelled',
    'archived'
);


ALTER TYPE public.class_status OWNER TO postgres;

--
-- Name: class_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.class_type AS ENUM (
    'online',
    'offline',
    'hybrid'
);


ALTER TYPE public.class_type OWNER TO postgres;

--
-- Name: course_category_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.course_category_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.course_category_status OWNER TO postgres;

--
-- Name: course_module_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.course_module_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.course_module_status OWNER TO postgres;

--
-- Name: course_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.course_status AS ENUM (
    'active',
    'inactive',
    'archived'
);


ALTER TYPE public.course_status OWNER TO postgres;

--
-- Name: course_target_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.course_target_level AS ENUM (
    'beginner',
    'elementary',
    'intermediate',
    'upper_intermediate',
    'advanced'
);


ALTER TYPE public.course_target_level OWNER TO postgres;

--
-- Name: enrollment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enrollment_status AS ENUM (
    'active',
    'completed',
    'cancelled'
);


ALTER TYPE public.enrollment_status OWNER TO postgres;

--
-- Name: invoice_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.invoice_status AS ENUM (
    'draft',
    'issued',
    'paid',
    'cancelled'
);


ALTER TYPE public.invoice_status OWNER TO postgres;

--
-- Name: lesson_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lesson_status AS ENUM (
    'draft',
    'published',
    'archived'
);


ALTER TYPE public.lesson_status OWNER TO postgres;

--
-- Name: material_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.material_type AS ENUM (
    'pdf',
    'document',
    'slide',
    'image',
    'audio',
    'video',
    'link',
    'other'
);


ALTER TYPE public.material_type OWNER TO postgres;

--
-- Name: order_payment_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_payment_method AS ENUM (
    'sepay_bank_transfer',
    'sepay_card',
    'sepay_napas_bank_transfer',
    'manual_cash',
    'manual_bank_transfer'
);


ALTER TYPE public.order_payment_method OWNER TO postgres;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'awaiting_payment',
    'paid',
    'failed',
    'cancelled',
    'expired',
    'refunded'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- Name: payment_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_method AS ENUM (
    'BANK_TRANSFER',
    'CARD',
    'NAPAS_BANK_TRANSFER',
    'MANUAL_CASH',
    'MANUAL_BANK_TRANSFER'
);


ALTER TYPE public.payment_method OWNER TO postgres;

--
-- Name: payment_provider; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_provider AS ENUM (
    'sepay',
    'manual'
);


ALTER TYPE public.payment_provider OWNER TO postgres;

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'processing',
    'approved',
    'failed',
    'cancelled',
    'refunded'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- Name: room_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.room_status AS ENUM (
    'active',
    'maintenance',
    'inactive'
);


ALTER TYPE public.room_status OWNER TO postgres;

--
-- Name: session_mode; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.session_mode AS ENUM (
    'online',
    'offline'
);


ALTER TYPE public.session_mode OWNER TO postgres;

--
-- Name: session_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.session_status AS ENUM (
    'scheduled',
    'completed',
    'cancelled'
);


ALTER TYPE public.session_status OWNER TO postgres;

--
-- Name: student_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.student_level AS ENUM (
    'beginner',
    'elementary',
    'intermediate',
    'upper_intermediate',
    'advanced'
);


ALTER TYPE public.student_level OWNER TO postgres;

--
-- Name: user_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_status AS ENUM (
    'active',
    'inactive',
    'banned'
);


ALTER TYPE public.user_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assignment_attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignment_attachments (
    assignment_id uuid NOT NULL,
    title character varying(255),
    description text,
    file_bucket character varying(100),
    file_object_name character varying(500),
    external_url character varying(1000),
    content_type character varying(255),
    file_size integer,
    attachment_type public.assignment_attachment_type NOT NULL,
    order_index integer NOT NULL,
    uploaded_by uuid,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.assignment_attachments OWNER TO postgres;

--
-- Name: assignment_grades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignment_grades (
    submission_id uuid NOT NULL,
    assignment_id uuid NOT NULL,
    student_id uuid NOT NULL,
    score numeric(5,2),
    max_score numeric(5,2) NOT NULL,
    feedback text,
    rubric jsonb,
    graded_by uuid,
    graded_at timestamp with time zone,
    grading_method public.assignment_grading_method NOT NULL,
    ai_grading_result_id uuid,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.assignment_grades OWNER TO postgres;

--
-- Name: assignment_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignment_submissions (
    assignment_id uuid NOT NULL,
    student_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text,
    status public.assignment_submission_status NOT NULL,
    submitted_at timestamp with time zone,
    is_late boolean NOT NULL,
    attempt_number integer NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.assignment_submissions OWNER TO postgres;

--
-- Name: assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignments (
    class_id uuid NOT NULL,
    session_id uuid,
    lesson_id uuid,
    title character varying(255) NOT NULL,
    description text,
    instruction text,
    assignment_type public.assignment_type NOT NULL,
    status public.assignment_status NOT NULL,
    max_score numeric(5,2) NOT NULL,
    due_at timestamp with time zone,
    allow_late_submission boolean NOT NULL,
    created_by uuid NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.assignments OWNER TO postgres;

--
-- Name: attendances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendances (
    session_id uuid NOT NULL,
    class_id uuid NOT NULL,
    student_id uuid NOT NULL,
    status public.attendance_status NOT NULL,
    check_in_time timestamp with time zone,
    note text,
    recorded_by uuid,
    recorded_at timestamp with time zone,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.attendances OWNER TO postgres;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    cart_id uuid NOT NULL,
    course_id uuid NOT NULL,
    course_name character varying(255) NOT NULL,
    course_code character varying(100),
    unit_price numeric(12,2) NOT NULL,
    quantity integer NOT NULL,
    total_price numeric(12,2) NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    user_id uuid NOT NULL,
    status public.cart_status NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: class_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.class_sessions (
    class_id uuid NOT NULL,
    teacher_id uuid,
    lesson_id uuid,
    room_id uuid,
    title character varying(255) NOT NULL,
    description text,
    session_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    mode public.session_mode NOT NULL,
    meeting_url character varying(1000),
    status public.session_status NOT NULL,
    note text,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.class_sessions OWNER TO postgres;

--
-- Name: class_students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.class_students (
    class_id uuid NOT NULL,
    student_id uuid NOT NULL,
    enrollment_id uuid,
    enrollment_status public.class_enrollment_status NOT NULL,
    enrolled_at timestamp with time zone NOT NULL,
    final_score numeric(5,2),
    note text,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.class_students OWNER TO postgres;

--
-- Name: classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classes (
    course_id uuid NOT NULL,
    teacher_id uuid,
    name character varying(255) NOT NULL,
    code character varying(100),
    class_type public.class_type NOT NULL,
    max_students integer NOT NULL,
    start_date date,
    end_date date,
    status public.class_status NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.classes OWNER TO postgres;

--
-- Name: course_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_categories (
    name character varying(255) NOT NULL,
    slug character varying(255),
    description text,
    status public.course_category_status NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_categories OWNER TO postgres;

--
-- Name: course_category_mappings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_category_mappings (
    course_id uuid NOT NULL,
    category_id uuid NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_category_mappings OWNER TO postgres;

--
-- Name: course_enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_enrollments (
    user_id uuid NOT NULL,
    student_id uuid,
    course_id uuid NOT NULL,
    order_id uuid,
    order_item_id uuid,
    enrollment_status public.enrollment_status NOT NULL,
    enrolled_at timestamp with time zone NOT NULL,
    completed_at timestamp with time zone,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_enrollments OWNER TO postgres;

--
-- Name: course_modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_modules (
    course_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    order_index integer NOT NULL,
    status public.course_module_status NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_modules OWNER TO postgres;

--
-- Name: course_outcomes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_outcomes (
    course_id uuid NOT NULL,
    outcome_text text NOT NULL,
    order_index integer NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_outcomes OWNER TO postgres;

--
-- Name: course_requirements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_requirements (
    course_id uuid NOT NULL,
    requirement_text text NOT NULL,
    order_index integer NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_requirements OWNER TO postgres;

--
-- Name: course_tag_mappings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_tag_mappings (
    course_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_tag_mappings OWNER TO postgres;

--
-- Name: course_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_tags (
    name character varying(255) NOT NULL,
    slug character varying(255),
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_tags OWNER TO postgres;

--
-- Name: course_wishlists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_wishlists (
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.course_wishlists OWNER TO postgres;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    name character varying(255) NOT NULL,
    code character varying(100) NOT NULL,
    slug character varying(255),
    description text,
    thumbnail_bucket character varying(100),
    thumbnail_object_name character varying(500),
    target_level public.course_target_level,
    output_goal text,
    duration_weeks integer,
    total_sessions integer,
    price numeric(12,2) NOT NULL,
    status public.course_status NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_items (
    invoice_id uuid NOT NULL,
    course_id uuid,
    item_name character varying(255) NOT NULL,
    item_code character varying(100),
    unit_price numeric(12,2) NOT NULL,
    quantity integer NOT NULL,
    total_price numeric(12,2) NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.invoice_items OWNER TO postgres;

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    invoice_number character varying(50) NOT NULL,
    invoice_status public.invoice_status NOT NULL,
    issued_at timestamp with time zone,
    paid_at timestamp with time zone,
    buyer_name character varying(255),
    buyer_email character varying(255),
    buyer_phone character varying(30),
    billing_address text,
    currency character varying(10) NOT NULL,
    subtotal_amount numeric(12,2) NOT NULL,
    discount_amount numeric(12,2) NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    invoice_metadata jsonb,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: lesson_materials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lesson_materials (
    lesson_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    material_type public.material_type NOT NULL,
    file_bucket character varying(100),
    file_object_name character varying(500),
    external_url character varying(1000),
    order_index integer NOT NULL,
    is_downloadable boolean NOT NULL,
    created_by uuid,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.lesson_materials OWNER TO postgres;

--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    course_id uuid NOT NULL,
    module_id uuid,
    title character varying(255) NOT NULL,
    description text,
    content text,
    order_index integer NOT NULL,
    estimated_duration_minutes integer,
    status public.lesson_status NOT NULL,
    created_by uuid,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    order_id uuid NOT NULL,
    course_id uuid NOT NULL,
    course_name character varying(255) NOT NULL,
    course_code character varying(100),
    unit_price numeric(12,2) NOT NULL,
    quantity integer NOT NULL,
    total_price numeric(12,2) NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    user_id uuid NOT NULL,
    student_id uuid,
    cart_id uuid,
    order_code character varying(50) NOT NULL,
    invoice_number character varying(50) NOT NULL,
    status public.order_status NOT NULL,
    currency character varying(10) NOT NULL,
    subtotal_amount numeric(12,2) NOT NULL,
    discount_amount numeric(12,2) NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    note text,
    payment_method public.order_payment_method,
    paid_at timestamp with time zone,
    cancelled_at timestamp with time zone,
    expired_at timestamp with time zone,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    order_id uuid NOT NULL,
    invoice_id uuid,
    user_id uuid NOT NULL,
    provider public.payment_provider NOT NULL,
    payment_method public.payment_method NOT NULL,
    status public.payment_status NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency character varying(10) NOT NULL,
    provider_payment_id character varying(255),
    provider_transaction_id character varying(255),
    checkout_url text,
    raw_request jsonb,
    raw_response jsonb,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    code character varying(150) NOT NULL,
    name character varying(255),
    description text,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    name character varying(100) NOT NULL,
    description text,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    name character varying(100) NOT NULL,
    capacity integer NOT NULL,
    location character varying(255),
    status public.room_status NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- Name: sepay_ipn_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sepay_ipn_logs (
    order_id uuid,
    payment_id uuid,
    invoice_number character varying(50),
    notification_type character varying(100),
    sepay_order_id character varying(255),
    sepay_transaction_id character varying(255),
    transaction_status character varying(100),
    payload jsonb NOT NULL,
    headers jsonb,
    is_valid boolean NOT NULL,
    processed_at timestamp with time zone,
    error_message text,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.sepay_ipn_logs OWNER TO postgres;

--
-- Name: staff_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff_profiles (
    user_id uuid NOT NULL,
    "position" character varying(255),
    department character varying(255),
    note text,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.staff_profiles OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    user_id uuid NOT NULL,
    date_of_birth date,
    gender character varying(20),
    address text,
    level public.student_level,
    learning_goal text,
    parent_name character varying(255),
    parent_phone character varying(30),
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: submission_attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.submission_attachments (
    submission_id uuid NOT NULL,
    title character varying(255),
    file_bucket character varying(100) NOT NULL,
    file_object_name character varying(500) NOT NULL,
    original_filename character varying(255),
    content_type character varying(255),
    file_size integer,
    uploaded_by uuid,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.submission_attachments OWNER TO postgres;

--
-- Name: teachers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teachers (
    user_id uuid NOT NULL,
    specialization character varying(255),
    bio text,
    experience_years integer NOT NULL,
    certificates jsonb,
    hourly_rate numeric(12,2),
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.teachers OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(30),
    password_hash character varying(255) NOT NULL,
    avatar_url character varying(500),
    status public.user_status NOT NULL,
    is_verified boolean NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: assignment_attachments assignment_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_attachments
    ADD CONSTRAINT assignment_attachments_pkey PRIMARY KEY (id);


--
-- Name: assignment_grades assignment_grades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_grades
    ADD CONSTRAINT assignment_grades_pkey PRIMARY KEY (id);


--
-- Name: assignment_submissions assignment_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_pkey PRIMARY KEY (id);


--
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);


--
-- Name: attendances attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: class_sessions class_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT class_sessions_pkey PRIMARY KEY (id);


--
-- Name: class_students class_students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_students
    ADD CONSTRAINT class_students_pkey PRIMARY KEY (id);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: course_categories course_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_categories
    ADD CONSTRAINT course_categories_pkey PRIMARY KEY (id);


--
-- Name: course_category_mappings course_category_mappings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_category_mappings
    ADD CONSTRAINT course_category_mappings_pkey PRIMARY KEY (id);


--
-- Name: course_enrollments course_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_pkey PRIMARY KEY (id);


--
-- Name: course_modules course_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_pkey PRIMARY KEY (id);


--
-- Name: course_outcomes course_outcomes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_outcomes
    ADD CONSTRAINT course_outcomes_pkey PRIMARY KEY (id);


--
-- Name: course_requirements course_requirements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_requirements
    ADD CONSTRAINT course_requirements_pkey PRIMARY KEY (id);


--
-- Name: course_tag_mappings course_tag_mappings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_tag_mappings
    ADD CONSTRAINT course_tag_mappings_pkey PRIMARY KEY (id);


--
-- Name: course_tags course_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_tags
    ADD CONSTRAINT course_tags_pkey PRIMARY KEY (id);


--
-- Name: course_wishlists course_wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_wishlists
    ADD CONSTRAINT course_wishlists_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: lesson_materials lesson_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_materials
    ADD CONSTRAINT lesson_materials_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_code_key UNIQUE (code);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: sepay_ipn_logs sepay_ipn_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sepay_ipn_logs
    ADD CONSTRAINT sepay_ipn_logs_pkey PRIMARY KEY (id);


--
-- Name: staff_profiles staff_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_profiles
    ADD CONSTRAINT staff_profiles_pkey PRIMARY KEY (id);


--
-- Name: staff_profiles staff_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_profiles
    ADD CONSTRAINT staff_profiles_user_id_key UNIQUE (user_id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: students students_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_key UNIQUE (user_id);


--
-- Name: submission_attachments submission_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submission_attachments
    ADD CONSTRAINT submission_attachments_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_user_id_key UNIQUE (user_id);


--
-- Name: assignment_submissions uq_assignment_submission_attempt; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT uq_assignment_submission_attempt UNIQUE (assignment_id, student_id, attempt_number);


--
-- Name: attendances uq_attendances_session_student; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT uq_attendances_session_student UNIQUE (session_id, student_id);


--
-- Name: cart_items uq_cart_items_cart_course; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT uq_cart_items_cart_course UNIQUE (cart_id, course_id);


--
-- Name: class_students uq_class_students_class_student; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_students
    ADD CONSTRAINT uq_class_students_class_student UNIQUE (class_id, student_id);


--
-- Name: course_category_mappings uq_course_category_mapping; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_category_mappings
    ADD CONSTRAINT uq_course_category_mapping UNIQUE (course_id, category_id);


--
-- Name: course_enrollments uq_course_enrollments_user_course; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT uq_course_enrollments_user_course UNIQUE (user_id, course_id);


--
-- Name: course_tag_mappings uq_course_tag_mapping; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_tag_mappings
    ADD CONSTRAINT uq_course_tag_mapping UNIQUE (course_id, tag_id);


--
-- Name: course_wishlists uq_course_wishlists_user_course; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_wishlists
    ADD CONSTRAINT uq_course_wishlists_user_course UNIQUE (user_id, course_id);


--
-- Name: role_permissions uq_role_permissions_role_permission; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT uq_role_permissions_role_permission PRIMARY KEY (role_id, permission_id);


--
-- Name: user_roles uq_user_roles_user_role; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT uq_user_roles_user_role PRIMARY KEY (user_id, role_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_assignment_attachments_assignment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_assignment_attachments_assignment_id ON public.assignment_attachments USING btree (assignment_id);


--
-- Name: ix_assignment_grades_assignment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_assignment_grades_assignment_id ON public.assignment_grades USING btree (assignment_id);


--
-- Name: ix_assignment_grades_student_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_assignment_grades_student_id ON public.assignment_grades USING btree (student_id);


--
-- Name: ix_assignment_grades_submission_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_assignment_grades_submission_id ON public.assignment_grades USING btree (submission_id);


--
-- Name: ix_assignment_submissions_assignment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_assignment_submissions_assignment_id ON public.assignment_submissions USING btree (assignment_id);


--
-- Name: ix_assignment_submissions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_assignment_submissions_status ON public.assignment_submissions USING btree (status);


--
-- Name: ix_assignment_submissions_student_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_assignment_submissions_student_id ON public.assignment_submissions USING btree (student_id);


--
-- Name: ix_assignment_submissions_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_assignment_submissions_user_id ON public.assignment_submissions USING btree (user_id);


--
-- Name: ix_assignments_assignment_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_assignments_assignment_type ON public.assignments USING btree (assignment_type);


--
-- Name: ix_assignments_class_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_assignments_class_id ON public.assignments USING btree (class_id);


--
-- Name: ix_assignments_due_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_assignments_due_at ON public.assignments USING btree (due_at);


--
-- Name: ix_assignments_lesson_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_assignments_lesson_id ON public.assignments USING btree (lesson_id);


--
-- Name: ix_assignments_session_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_assignments_session_id ON public.assignments USING btree (session_id);


--
-- Name: ix_assignments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_assignments_status ON public.assignments USING btree (status);


--
-- Name: ix_attendances_class_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_attendances_class_id ON public.attendances USING btree (class_id);


--
-- Name: ix_attendances_session_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_attendances_session_id ON public.attendances USING btree (session_id);


--
-- Name: ix_attendances_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_attendances_status ON public.attendances USING btree (status);


--
-- Name: ix_attendances_student_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_attendances_student_id ON public.attendances USING btree (student_id);


--
-- Name: ix_cart_items_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_cart_items_cart_id ON public.cart_items USING btree (cart_id);


--
-- Name: ix_cart_items_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_cart_items_course_id ON public.cart_items USING btree (course_id);


--
-- Name: ix_carts_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_carts_user_id ON public.carts USING btree (user_id);


--
-- Name: ix_class_sessions_class_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_class_sessions_class_id ON public.class_sessions USING btree (class_id);


--
-- Name: ix_class_sessions_room_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_class_sessions_room_id ON public.class_sessions USING btree (room_id);


--
-- Name: ix_class_sessions_session_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_class_sessions_session_date ON public.class_sessions USING btree (session_date);


--
-- Name: ix_class_sessions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_class_sessions_status ON public.class_sessions USING btree (status);


--
-- Name: ix_class_sessions_teacher_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_class_sessions_teacher_id ON public.class_sessions USING btree (teacher_id);


--
-- Name: ix_class_students_class_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_class_students_class_id ON public.class_students USING btree (class_id);


--
-- Name: ix_class_students_enrollment_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_class_students_enrollment_status ON public.class_students USING btree (enrollment_status);


--
-- Name: ix_class_students_student_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_class_students_student_id ON public.class_students USING btree (student_id);


--
-- Name: ix_classes_class_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_classes_class_type ON public.classes USING btree (class_type);


--
-- Name: ix_classes_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_classes_code ON public.classes USING btree (code);


--
-- Name: ix_classes_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_classes_course_id ON public.classes USING btree (course_id);


--
-- Name: ix_classes_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_classes_status ON public.classes USING btree (status);


--
-- Name: ix_classes_teacher_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_classes_teacher_id ON public.classes USING btree (teacher_id);


--
-- Name: ix_course_categories_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_course_categories_name ON public.course_categories USING btree (name);


--
-- Name: ix_course_categories_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_course_categories_slug ON public.course_categories USING btree (slug);


--
-- Name: ix_course_categories_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_course_categories_status ON public.course_categories USING btree (status);


--
-- Name: ix_course_enrollments_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_course_enrollments_course_id ON public.course_enrollments USING btree (course_id);


--
-- Name: ix_course_enrollments_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_course_enrollments_user_id ON public.course_enrollments USING btree (user_id);


--
-- Name: ix_course_tags_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_course_tags_name ON public.course_tags USING btree (name);


--
-- Name: ix_course_tags_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_course_tags_slug ON public.course_tags USING btree (slug);


--
-- Name: ix_course_wishlists_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_course_wishlists_course_id ON public.course_wishlists USING btree (course_id);


--
-- Name: ix_course_wishlists_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_course_wishlists_user_id ON public.course_wishlists USING btree (user_id);


--
-- Name: ix_courses_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_courses_code ON public.courses USING btree (code);


--
-- Name: ix_courses_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_courses_name ON public.courses USING btree (name);


--
-- Name: ix_courses_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_courses_slug ON public.courses USING btree (slug);


--
-- Name: ix_courses_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_courses_status ON public.courses USING btree (status);


--
-- Name: ix_courses_target_level; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_courses_target_level ON public.courses USING btree (target_level);


--
-- Name: ix_invoices_invoice_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_invoices_invoice_number ON public.invoices USING btree (invoice_number);


--
-- Name: ix_invoices_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_invoices_order_id ON public.invoices USING btree (order_id);


--
-- Name: ix_lesson_materials_lesson_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_lesson_materials_lesson_id ON public.lesson_materials USING btree (lesson_id);


--
-- Name: ix_lessons_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_lessons_course_id ON public.lessons USING btree (course_id);


--
-- Name: ix_lessons_module_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_lessons_module_id ON public.lessons USING btree (module_id);


--
-- Name: ix_orders_invoice_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_orders_invoice_number ON public.orders USING btree (invoice_number);


--
-- Name: ix_orders_order_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_orders_order_code ON public.orders USING btree (order_code);


--
-- Name: ix_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_orders_status ON public.orders USING btree (status);


--
-- Name: ix_orders_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_orders_user_id ON public.orders USING btree (user_id);


--
-- Name: ix_payments_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_payments_order_id ON public.payments USING btree (order_id);


--
-- Name: ix_payments_provider_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_payments_provider_transaction_id ON public.payments USING btree (provider_transaction_id);


--
-- Name: ix_payments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_payments_status ON public.payments USING btree (status);


--
-- Name: ix_rooms_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_rooms_name ON public.rooms USING btree (name);


--
-- Name: ix_rooms_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_rooms_status ON public.rooms USING btree (status);


--
-- Name: ix_sepay_ipn_logs_invoice_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_sepay_ipn_logs_invoice_number ON public.sepay_ipn_logs USING btree (invoice_number);


--
-- Name: ix_sepay_ipn_logs_sepay_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_sepay_ipn_logs_sepay_transaction_id ON public.sepay_ipn_logs USING btree (sepay_transaction_id);


--
-- Name: ix_submission_attachments_submission_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_submission_attachments_submission_id ON public.submission_attachments USING btree (submission_id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: assignment_attachments assignment_attachments_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_attachments
    ADD CONSTRAINT assignment_attachments_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id);


--
-- Name: assignment_attachments assignment_attachments_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_attachments
    ADD CONSTRAINT assignment_attachments_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: assignment_grades assignment_grades_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_grades
    ADD CONSTRAINT assignment_grades_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id);


--
-- Name: assignment_grades assignment_grades_graded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_grades
    ADD CONSTRAINT assignment_grades_graded_by_fkey FOREIGN KEY (graded_by) REFERENCES public.users(id);


--
-- Name: assignment_grades assignment_grades_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_grades
    ADD CONSTRAINT assignment_grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: assignment_grades assignment_grades_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_grades
    ADD CONSTRAINT assignment_grades_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.assignment_submissions(id);


--
-- Name: assignment_submissions assignment_submissions_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id);


--
-- Name: assignment_submissions assignment_submissions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: assignment_submissions assignment_submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT assignment_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: assignments assignments_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: assignments assignments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: assignments assignments_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);


--
-- Name: assignments assignments_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.class_sessions(id);


--
-- Name: attendances attendances_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: attendances attendances_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.users(id);


--
-- Name: attendances attendances_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.class_sessions(id);


--
-- Name: attendances attendances_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: cart_items cart_items_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: class_sessions class_sessions_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT class_sessions_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: class_sessions class_sessions_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT class_sessions_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);


--
-- Name: class_sessions class_sessions_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT class_sessions_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- Name: class_sessions class_sessions_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT class_sessions_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: class_students class_students_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_students
    ADD CONSTRAINT class_students_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: class_students class_students_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_students
    ADD CONSTRAINT class_students_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.course_enrollments(id);


--
-- Name: class_students class_students_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_students
    ADD CONSTRAINT class_students_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: classes classes_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: classes classes_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: course_category_mappings course_category_mappings_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_category_mappings
    ADD CONSTRAINT course_category_mappings_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.course_categories(id);


--
-- Name: course_category_mappings course_category_mappings_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_category_mappings
    ADD CONSTRAINT course_category_mappings_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: course_enrollments course_enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: course_enrollments course_enrollments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: course_enrollments course_enrollments_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(id);


--
-- Name: course_enrollments course_enrollments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: course_enrollments course_enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: course_modules course_modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: course_outcomes course_outcomes_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_outcomes
    ADD CONSTRAINT course_outcomes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: course_requirements course_requirements_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_requirements
    ADD CONSTRAINT course_requirements_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: course_tag_mappings course_tag_mappings_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_tag_mappings
    ADD CONSTRAINT course_tag_mappings_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: course_tag_mappings course_tag_mappings_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_tag_mappings
    ADD CONSTRAINT course_tag_mappings_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.course_tags(id);


--
-- Name: course_wishlists course_wishlists_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_wishlists
    ADD CONSTRAINT course_wishlists_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: course_wishlists course_wishlists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_wishlists
    ADD CONSTRAINT course_wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: invoice_items invoice_items_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: invoice_items invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);


--
-- Name: invoices invoices_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: invoices invoices_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: lesson_materials lesson_materials_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_materials
    ADD CONSTRAINT lesson_materials_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: lesson_materials lesson_materials_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_materials
    ADD CONSTRAINT lesson_materials_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);


--
-- Name: lessons lessons_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: lessons lessons_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: lessons lessons_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.course_modules(id);


--
-- Name: order_items order_items_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: orders orders_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: orders orders_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: sepay_ipn_logs sepay_ipn_logs_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sepay_ipn_logs
    ADD CONSTRAINT sepay_ipn_logs_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: sepay_ipn_logs sepay_ipn_logs_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sepay_ipn_logs
    ADD CONSTRAINT sepay_ipn_logs_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id);


--
-- Name: staff_profiles staff_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_profiles
    ADD CONSTRAINT staff_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: students students_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: submission_attachments submission_attachments_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submission_attachments
    ADD CONSTRAINT submission_attachments_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.assignment_submissions(id);


--
-- Name: submission_attachments submission_attachments_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submission_attachments
    ADD CONSTRAINT submission_attachments_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: teachers teachers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict EijXwzO1agm1iVOFtuTkOOKhrKeZNpKUgHVhZAj80aRSgkIbrI7vJH1boXDnUip

